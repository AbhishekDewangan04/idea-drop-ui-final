const http = require("http");
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(
  __dirname,
  "src",
  "data",
  "db.json"
);

const FRONTEND =
"https://idea-drop-ui-final.vercel.app";

function readDB() {
  try {
    return JSON.parse(
      fs.readFileSync(
        DB_PATH,
        "utf8"
      )
    );
  } catch (err) {
    console.error(
      "DB READ ERROR:",
      err
    );

    return {
      ideas: [],
      users: [],
    };
  }
}

function writeDB(data) {
  fs.writeFileSync(
    DB_PATH,
    JSON.stringify(
      data,
      null,
      2
    )
  );
}

function sendJSON(
  res,
  status,
  data
) {
  res.writeHead(
    status,
    {
      "Content-Type":
        "application/json",

      "Access-Control-Allow-Origin":
        FRONTEND,

      "Access-Control-Allow-Credentials":
        "false",

      "Access-Control-Allow-Headers":
        "Content-Type, Authorization",

      "Access-Control-Allow-Methods":
        "GET,POST,PUT,DELETE,OPTIONS",
    }
  );

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
      try {
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

        let url =
          req.url;

        const method =
          req.method;

        if (
          url.startsWith(
            "/api"
          )
        ) {
          url =
            url.replace(
              "/api",
              ""
            );
        }

        console.log(
          method,
          url
        );

        const db =
          readDB();

        db.ideas =
          Array.isArray(
            db.ideas
          )
            ? db.ideas
            : [];

        db.users =
          Array.isArray(
            db.users
          )
            ? db.users
            : [];

        // GET IDEAS
        if (
          method ===
            "GET" &&
          url.startsWith(
            "/ideas"
          )
        ) {
          return sendJSON(
            res,
            200,
            db.ideas
          );
        }

        // CREATE IDEA
        if (
          method ===
            "POST" &&
          url ===
            "/ideas"
        ) {
          const body =
            await parseBody(
              req
            );

          const idea =
            {
              id:
                Date.now().toString(),

              ...body,

              createdAt:
                new Date().toISOString(),
            };

          db.ideas.push(
            idea
          );

          writeDB(
            db
          );

          return sendJSON(
            res,
            201,
            idea
          );
        }

        // LOGIN
        if (
          method ===
            "POST" &&
          url ===
            "/auth/login"
        ) {
          const body =
            await parseBody(
              req
            );

          const email =
            String(
              body.email ||
                ""
            )
              .trim()
              .toLowerCase();

          const password =
            String(
              body.password ||
                ""
            ).trim();

          const user =
            db.users.find(
              (
                u
              ) =>
                u.email
                  .toLowerCase() ===
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

        // REFRESH
        if (
          method ===
            "POST" &&
          url ===
            "/auth/refresh"
        ) {
          return sendJSON(
            res,
            200,
            {
              accessToken:
                "fake-token",

              user:
                null,
            }
          );
        }

        return sendJSON(
          res,
          404,
          {
            message:
              "Route not found",
          }
        );
      } catch (
        err
      ) {
        console.error(
          err
        );

        return sendJSON(
          res,
          500,
          {
            message:
              "Server error",
          }
        );
      }
    }
  );

const PORT =
  process.env.PORT ||
  8080;



server.listen(
  PORT,
  () => {
    console.log(
      `Running on ${PORT}`
    );
  }
);