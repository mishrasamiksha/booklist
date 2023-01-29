import { json } from "@sveltejs/kit";

import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { toUtf8, fromUtf8 } from "@aws-sdk/util-utf8-node";

import { AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, UPLOAD_FROM_URL_LAMBDA } from "$env/static/private";

export async function POST({ cookies, locals, request }: any) {
  const session = await locals.getSession();
  if (!session) {
    return { success: false };
  }

  const reqBody = await request.json();

  const { url } = reqBody;
  const { userId } = session;

  console.log({ url: reqBody.url });

  try {
    const client = new LambdaClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: AMAZON_ACCESS_KEY,
        secretAccessKey: AMAZON_SECRET_KEY
      }
    });
    const command = new InvokeCommand({
      FunctionName: UPLOAD_FROM_URL_LAMBDA,
      Payload: fromUtf8(JSON.stringify({ url, userId }))
    });
    const response = await client.send(command);

    if (response.Payload) {
      const respJson = JSON.parse(toUtf8(response.Payload));

      return json(respJson);
    } else {
      return json({ error: true });
    }
  } catch (er) {
    console.log("Error invoking lambda", er);
    return json({ error: true });
  }
}
