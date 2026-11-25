
import PocketBase from "pocketbase";

// The address where PocketBase is running
const pocketbaseUrl = process.env.POCKETBASE_URL || "http://127.0.0.1:8090";

// Create a connection to PocketBase
const pb = new PocketBase(pocketbaseUrl);

// Prevent requests from cancelling each other automatically
pb.autoCancellation(false);

export default pb;
