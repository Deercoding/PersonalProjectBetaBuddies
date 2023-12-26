import client from "./elastic-client.js";
import TagList from "../models/taglist-model.js";
import { BoulderingChat } from "../models/chat-model.js";
import TagRoom from "../models/tagroom-model.js";

export async function searchKeyword() {
  let notTaggedChats = await BoulderingChat.find({ tagSearched: false }).select(
    "content roomId tagSearched roomNumericId -_id "
  );
  console.log(notTaggedChats);

  await BoulderingChat.updateMany(
    { tagSearched: false },
    { $set: { tagSearched: true } }
  );
  let tagList = await TagList.find({}).select("tag usedCount -_id");

  const chatsByRoom = notTaggedChats.reduce((accumulator, currentValue) => {
    const { roomNumericId, content } = currentValue;
    if (!accumulator[roomNumericId]) {
      accumulator[roomNumericId] = [];
    }
    accumulator[roomNumericId].push(content);
    return accumulator;
  }, {});
  const chatsByRoomGroupContent = Object.entries(chatsByRoom).map(
    ([roomNumericId, contentArray]) => ({
      roomNumericId,
      content: contentArray.join(","),
    })
  );

  const tags = tagList.map((tag) => tag.tag);

  for (let i = 0; i < chatsByRoomGroupContent.length; i++) {
    let chats = chatsByRoomGroupContent[i];
    let addresult = await addDocumentToIndex(
      client,
      { content: chats.content },
      chats.roomNumericId
    );
    console.log(chats.roomNumericId);
    console.log(addresult);

    let roomTag = {};
    const clientSearchs = tags;
    for (let i = 0; i < clientSearchs.length; i++) {
      await client.indices.refresh({ index: chats.roomNumericId }); //!!!
      const result = await searchKeyCn(
        client,
        chats.roomNumericId,
        clientSearchs[i]
      );
      console.log(result?.hits);

      const hitsTotalValue = result.hits.total.value;
      if (hitsTotalValue > 0) {
        roomTag[clientSearchs[i]] = hitsTotalValue;
      }
    }

    const roomTagKeys = Object.keys(roomTag);
    const roomTagValues = Object.values(roomTag);

    for (let i = 0; i < roomTagKeys.length; i++) {
      const conditions = {
        roomNumericId: chats.roomNumericId,
        tag: roomTagKeys[i],
      };

      let roomTagPair = await TagRoom.find(conditions);

      if (roomTagPair.length > 0) {
        const update = { $inc: { tagCount: 1 } };
        await TagRoom.findOneAndUpdate(conditions, update, { upsert: true });
      } else {
        const saveTag = new TagRoom({
          roomNumericId: chats.roomNumericId,
          tag: roomTagKeys[i],
          tagCount: roomTagValues[i],
        });
        await saveTag.save();
      }
    }
  }
}

export async function searchTags(client, myindex, mysearch) {
  const autocomplete = await searchDocuments(client, myindex, mysearch);
  return autocomplete;
}

export async function searchKeyCn(client, index, searchWord) {
  const response = await client.search({
    index: index,
    _source: [],
    query: {
      match_phrase: {
        content: searchWord,
      },
    },
  });

  return response;
}

export async function addDocumentToIndex(client, documents, myindex) {
  try {
    const result = await client.index({
      index: myindex,
      body: {
        mappings: {
          properties: {
            content: {
              type: "text",
              analyzer: "ik_max_word",
            },
          },
        },
      },
      body: documents,
    });

    console.log(`Document indexed successfully: ${result}`);
    console.log(result);
  } catch (error) {
    console.error("Error indexing document:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

export async function createAutocompleteIndex(client, myindex) {
  await client.indices.create({
    index: myindex,
    body: {
      settings: {
        analysis: {
          filter: {
            autocomplete_filter: {
              type: "edge_ngram",
              min_gram: 1,
              max_gram: 20,
            },
          },
          analyzer: {
            autocomplete: {
              type: "custom",
              tokenizer: "standard",
              filter: ["lowercase", "autocomplete_filter"],
            },
          },
        },
      },
      mappings: {
        properties: {
          text: {
            type: "text",
            analyzer: "autocomplete",
            search_analyzer: "standard",
          },
        },
      },
    },
  });
}

export async function addDocumentinAutocomplete(client, documents, myindex) {
  const operations = documents.flatMap((doc) => [
    { index: { _index: myindex } },
    doc,
  ]);
  const bulkResponse = await client.bulk({ refresh: true, operations });
  if (bulkResponse.errors) {
    const erroredDocuments = [];
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0];
      if (action[operation].error) {
        erroredDocuments.push({
          status: action[operation].status,
          error: action[operation].error,
          operation: operations[i * 2],
          document: operations[i * 2 + 1],
        });
      }
    });
    console.log(erroredDocuments);
  }
  console.log(bulkResponse);
}

export async function searchDocuments(client, myindex, mysearch) {
  const response = await client.search({
    index: myindex,
    body: {
      query: {
        match: {
          text: {
            query: mysearch,
            // operator: "and",
          },
        },
      },
    },
  });

  return response.hits.hits;
}
