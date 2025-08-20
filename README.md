<div align="center">
  <br />
   <p>
    <img src="https://share.baibusu.social/ZiCX0UZb.png">
  </p>
</div>

# **Baibusu.Social API**

API service for our Discord bots and other services/servers. Intended for private use only and not available to the public outside of our associated bots and/or services. Documentation however is [provided](https://api.baibusu.social/docs) via scalar. Any issues with this service can be directed to Support Staff or by submitting and issue.

## Self-Hosting

> _Notice_: Repeated requests for aid with self-hosting will lead to a ban from the support server.

As with all our projects they not intended to be self-hosted, we highly encourage you to invite our bots to use the services that way. Self-hosting is permitted but will never be supported. Source code is provided in the interest
of being open with out community. Ultimately no help or guidance will be provided for setup, editing, or any action from running our services within your own environment. Joining of the development and testing server is permitted but questions about
self-hosting will be disregarded entirely. Self-hosting is done at you own risk.

Generally the included docker-compose.yml along with .env should include everything you need to run anything we produce.

### Running this service

Create needed directory.

`mkdir babibusu`

Fetch required files

```bash
wget -O babibusu/docker-compose.yml https://raw.githubusercontent.com/baibusu-social/api/refs/heads/release/compose-example.yml
cd baibusu
```

Make any edits required in the docker-compose.yml file, you may comment out any items you don't need. If they are listed in `depends_on` you must leave them or you
will encounter errors. All API keys are mandatory.

`docker compose up -d`
