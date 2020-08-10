endpoints:
  https://u9pwl8bl3i.execute-api.us-east-1.amazonaws.com/dev/nsfaq-card


serverless logs -f nsfaq-card -t
serverless deploy function --function inteligent-design-rating

To install plugins
npm install --save-dev serverless-prune-plugin

To fix "serverless code storage limit exceeded":
https://www.npmjs.com/package/serverless-prune-plugin

Another fix
https://aws.amazon.com/blogs/devops/continue-rolling-back-an-update-for-aws-cloudformation-stacks-in-the-update_rollback_failed-state/

=================
Test locally:
=================
(in a terminal tab)
nodemon --exec 'serverless offline start'

(in a new terminal tab)
ngrok http 3000

(on the browser)
http://ed2fe29a.ngrok.io/dev/ping








