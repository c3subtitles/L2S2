import { currentTalk, nextTalk } from '../fahrplan';

global.router.get('/api/currentTalk/:id', async function(ctx) {
  const talk = await currentTalk(ctx.params.id);
  if (!talk) {
    ctx.status = 404;
    return;
  }
  ctx.body = talk;
  ctx.status = 200;
});

global.router.get('/api/nextTalk/:id', async function(ctx) {
  const talk = await nextTalk(ctx.params.id);
  if (!talk) {
    ctx.status = 404;
    return;
  }
  ctx.body = talk;
  ctx.status = 200;
});
