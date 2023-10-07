![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-undb

n8n nodes undb

## Prerequisites

- Install n8n with:
  ```
  npm install n8n -g
  ```
- Recommended: follow n8n's guide to [set up your development environment](https://docs.n8n.io/integrations/creating-nodes/build/node-development-environment/).

- Clone this repo into `~/.n8n/custom

  > If `~/.n8n/custom` does not exists, you should create it manually.

- Inside `n8n-nodes-undb` project, install and build.

  ```
  npm install
  npm run build
  ```

- Link `n8n-nodes-undb`

  ```
  npm link
  ```

- Then goto global n8n location and link n8n with `n8n-nodes-undb`

  ```
  npm link @undb/n8n-nodes-undb
  ```

  > You can get the n8n location by running `npm list -g`, goto the path print with post path `node_modules/n8n`

- Back to `n8n-nodes-undb` and run dev script

  ```
  npm run dev
  ```

## More information

Refer to our [documentation on creating nodes](https://docs.n8n.io/integrations/creating-nodes/) for detailed information on building your own nodes.

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
