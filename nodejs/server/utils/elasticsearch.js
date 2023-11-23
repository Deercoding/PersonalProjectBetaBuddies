import { Client } from "@elastic/elasticsearch";
import fs from "fs";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import url from "url";
import TagList from "../models/taglist-model.js";
import { BoulderingChat } from "../models/chat-model.js";
import TagRoom from "../models/tagRoom-model.js";

dotenv.config({ path: "./.env" });
const router = express.Router();
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: process.env.ELASTIC_PASSWORD,
  },
  tls: {
    ca: fs.readFileSync(path.join(__dirname, "./http_ca.crt")),
    rejectUnauthorized: true,
  },
});

// const interval = 1000;
// setInterval(await processQueue, interval);
// schedule time
searchKeyword();

async function searchKeyword() {
  // create bouldering term list
  // clear chat history, start some bouldering conversation- update the DB setup with "tagSearched"
  // for each new chat (check if tagSearched=0 )

  let notTaggedChats = await BoulderingChat.find({ tagSearched: false }).select(
    "content roomId tagSearched roomNumericId -_id "
  );
  let tagList = await TagList.find({}).select("tag usedCount -_id");

  // check keyword count by room, and add into the mongoDB keyword table
  // group by roomId
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

  //await createIndex(client, "abyellow");
  // await addDocumentToIndex(
  //   client,
  //   { content: chatsByRoomGroupContent[0].content },
  //   "abyellow"
  // );
  //await getAllDocuments(client, "abyellow");

  for (let i = 0; i < chatsByRoomGroupContent.length; i++) {
    let chats = chatsByRoomGroupContent[i];
    console.log(chats);
    // await addDocumentToIndex(
    //   client,
    //   { content: chats.content },
    //   chats.roomNumericId
    // );
    await getAllDocuments(client, chats.roomNumericId);
    //
    //
    //
    let roomTag = {};
    const clientSearchs = tags;
    for (let i = 0; i < clientSearchs.length; i++) {
      const result = await searchKeyCn(
        client,
        chats.roomNumericId,
        clientSearchs[i]
      );
      const hitsTotalValue = result.hits.total.value;
      if (hitsTotalValue > 0) {
        roomTag[clientSearchs[i]] = hitsTotalValue;
      }
    }

    // console.log(roomTag);

    const roomTagKeys = Object.keys(roomTag);
    const roomTagValues = Object.values(roomTag);

    // for (let i = 0; i < roomTagKeys.length; i++) {
    //   const conditions = {
    //     roomNumericId: chats.roomNumericId,
    //     tag: roomTagKeys[i],
    //   };

    //   let roomTagPair = await TagRoom.find(conditions);

    //   if (roomTagPair.length > 0) {
    //     const update = { $inc: { tagCount: 1 } };
    //     await TagRoom.findOneAndUpdate(conditions, update, { upsert: true });
    //   } else {
    //     const saveTag = new TagRoom({
    //       roomNumericId: chats.roomNumericId,
    //       tag: roomTagKeys[i],
    //       tagCount: roomTagValues[i],
    //     });
    //     await saveTag.save();
    //   }
    // }
  }
  // console.log(await TagRoom.find({}));

  // if searched, tagSearched=1
  // set function interval = 1000

  // let boulderingIndex = "test0903";
  // // createBulkCn(client, oneChatRoom, boulderingIndex);
  // let roomTage = {};
  // const clientSearchs = ["起攀", "V3", "V2", "V1", "指力", "體感"];
  // for (let i = 0; i < clientSearchs.length; i++) {
  //   const result = await searchKeyCn(client, boulderingIndex, clientSearchs[i]);
  //   const hitsTotalValue = result.hits.total.value;
  //   roomTage[clientSearchs[i]] = hitsTotalValue;
  // }
  // console.log(roomTage);
}

async function getAllDocuments(client, indexName) {
  try {
    // Search for all documents in the specified index
    const body = await client.search({
      index: indexName,
      body: {
        query: {
          match_all: {}, // Match all documents
        },
      },
    });

    // Extract and log the documents
    console.log("All documents:", body.hits.hits);
  } catch (error) {
    console.error("Error retrieving documents:", error);
  }
}

export async function searchKeyCn(client, index, searchWord) {
  const response = await client.search({
    index: index,
    scroll: "30s",
    _source: [],
    query: {
      match_phrase: {
        content: searchWord,
      },
    },
  });
  return response;
}

export async function createIndex(client, myindex) {
  client.indices.create({
    index: myindex,
    mappings: {
      properties: {
        roomId: {
          type: "text",
          analyzer: "ik_max_word",
        },
        content: {
          type: "text",
          analyzer: "ik_max_word",
        },
      },
    },
  });
}

export async function addDocumentToIndex(client, documents, myindex) {
  await client.index({
    index: myindex,
    body: documents,
  });
}

export async function createBulkCn(client, documents, myindex) {
  client.indices.create({
    index: myindex,
    mappings: {
      properties: {
        roomId: {
          type: "text",
          analyzer: "ik_max_word",
        },
        content: {
          type: "text",
          analyzer: "ik_max_word",
        },
      },
    },
  });
  const dataset = documents;
  console.log(dataset, myindex);
  console.log(typeof dataset);

  const operations = dataset.flatMap((doc) => [
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

  const count = await client.count({ index: myindex });
  console.log(count);
}

export default router;
