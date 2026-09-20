import { createServer } from 'node:http';

const clients = new Set();
let server;

function liveReloadClientScript(port) {
  return `(function () {
  if (window.__nominalcrewLiveReload) return;
  window.__nominalcrewLiveReload = true;
  var source = new EventSource('http://localhost:${port}/events');
  source.onmessage = function () {
    window.location.reload();
  };
  source.onerror = function () {};
})();`;
}

export function startLiveReloadServer(port = Number(process.env.LIVE_RELOAD_PORT) || 35729) {
  if (server) {
    return server;
  }

  server = createServer((request, response) => {
    const url = new URL(request.url ?? '/', `http://localhost:${port}`);

    if (url.pathname === '/live-reload.js') {
      response.writeHead(200, {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'no-cache'
      });
      response.end(liveReloadClientScript(port));
      return;
    }

    if (url.pathname === '/events') {
      response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });
      response.write(':\n\n');
      clients.add(response);

      request.on('close', () => {
        clients.delete(response);
      });

      return;
    }

    response.writeHead(404);
    response.end();
  });

  server.listen(port, '127.0.0.1', () => {
    console.log(`Live reload: http://localhost:${port}/live-reload.js`);
  });

  return server;
}

export function notifyLiveReload() {
  for (const client of clients) {
    client.write('data: reload\n\n');
  }

  if (clients.size > 0) {
    console.log(`Live reload: notified ${clients.size} browser tab(s)`);
  }
}
