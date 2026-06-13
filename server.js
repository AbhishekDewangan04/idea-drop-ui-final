const http = require("http");
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(
  __dirname,
  "src",
  "data",
  "db.json"
);

function readDB() {
  try {
    return JSON.parse(
      fs.readFileSync(
        DB_PATH,
        "utf8"
      )
    );
  } catch {
    return {
      ideas: [],
      users: [],
    };
  }
}

function sendJSON(
  res,
  status,
  data
) {
  res.writeHead(status, {
    "Content-Type":
      "application/json",

    "Access-Control-Allow-Origin":
      "https://idea-drop-ui-final-50f8fd0pps-abhisheks-projects-9a293ac2.vercel.app",

    "Access-Control-Allow-Credentials":
      "true",

    "Access-Control-Allow-Headers":
      "Content-Type, Authorization",

    "Access-Control-Allow-Methods":
      "GET, POST, OPTIONS",
  });

  res.end(
    JSON.stringify(data)
  );
}

function parseBody(req) {
  return new Promise(
    (resolve) => {
      let body = "";

      req.on(
        "data",
        (chunk) => {
          body += chunk;
        }
      );

      req.on(
        "end",
        () => {
          try {
            resolve(
              JSON.parse(
                body || "{}"
              )
            );
          } catch {
            resolve({});
          }
        }
      );
    }
  );
}

const server =
  http.createServer(
    async (
      req,
      res
    ) => {
      if (
        req.method ===
        "OPTIONS"
      ) {
        return sendJSON(
          res,
          200,
          {}
        );
      }

      const method =
        req.method;

      const url =
        req.url;

      // GET IDEAS
      if (
        url.startsWith(
          "/api/ideas"
        ) &&
        method ===
          "GET"
      ) {
        const db =
          readDB();

        return sendJSON(
          res,
          200,
          db.ideas ||
            []
        );
      }

      // LOGIN
      if (
        url ===
          "/api/auth/login" &&
        method ===
          "POST"
      ) {
        const body =
          await parseBody(
            req
          );

        const {
          email,
          password,
        } = body;

        const db =
          readDB();

        const user =
          (
            db.users ||
            []
          ).find(
            (u) =>
              u.email ===
                email &&
              u.password ===
                password
          );

        if (
          !user
        ) {
          return sendJSON(
            res,
            401,
            {
              message:
                "Invalid credentials",
            }
          );
        }

        return sendJSON(
          res,
          200,
          {
            accessToken:
              "fake-token",

            user: {
              id:
                user.id,
              name:
                user.name,
              email:
                user.email,
            },
          }
        );
      }

      // REGISTER
      if (
        url ===
          "/api/auth/register" &&
        method ===
          "POST"
      ) {
        const body =
          await parseBody(
            req
          );

        return sendJSON(
          res,
          201,
          {
            accessToken:
              "fake-token",

            user: {
              id:
                Date.now().toString(),

              name:
                body.name,

              email:
                body.email,
            },
          }
        );
      }

      // REFRESH
      if (
        url ===
          "/api/auth/refresh" &&
        method ===
          "POST"
      ) {
        return sendJSON(
          res,
          200,
          {
            accessToken:
              "fake-token",
          }
        );
      }

      return sendJSON(
        res,
        404,
        {
          message:
            "Not found",
        }
      );
    }
  );

const PORT =
  process.env
    .PORT || 3000;

server.listen(
  PORT,
  () => {
    console.log(
      `Running on ${PORT}`
    );
  }
);