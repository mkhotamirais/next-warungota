import { Client, Account } from "appwrite";

const apiEndpoint = process.env.APPWRITE_API_ENDPOINT as string;
const projectId = process.env.APPWRITE_PROJECT_ID as string;
// const dbIdNextDb = process.env.APPWRITE_DB_ID_NEXT_DB as string;
// const collIdPosts = process.env.APPWRITE_COLL_ID_POSTS as string;
// const urlBucket = process.env.APPWRITE_BUCKET_URL as string;
// const bucketIdNextBucket = process.env.APPWRITE_BUCKET_ID_NEXT_BUCKET as string;

export const client = new Client();

client.setEndpoint(apiEndpoint).setProject(projectId);

export const account = new Account(client);
// export const databases = new Databases(client);
// export const storage = new Storage(client);

export { ID } from "appwrite";
// export { apiEndpoint, projectId, dbIdNextDb, collIdPosts, urlBucket, bucketIdNextBucket };
export { apiEndpoint, projectId };
