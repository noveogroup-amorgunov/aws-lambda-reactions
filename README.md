# aws-lambda-reactions

Example of using **AWS Lambda** + **Typescript** for site reactions. You can see live demo in https://amorgunov.com/posts/2020-04-12-use-redux-with-react-hooks/ on bottom of the post: 

![](./preview.gif)

## Setup

### Register in AWS

- Create AWS account [here](http://aws.amazon.com/)
- Get AWS credentials ([read more](https://serverless.com/framework/docs/providers/aws/guide/credentials/) how get it).
- Export credentials to `~/.bash_profile` or terminal:

```bash
export AWS_ACCESS_KEY_ID=<ACCESS_KEY_ID>
export AWS_SECRET_ACCESS_KEY=<SECRET_ACCESS_KEY>
```

or add these variables to `~/.aws/credentials` (I recommend this way):

```bash
[default]
aws_access_key_id = <ACCESS_KEY_ID>
aws_secret_access_key = <SECRET_ACCESS_KEY>
```

## Usage

- Install dependencies

```bash
npm i
```

- Run lambda local:

```bash
npm run local
```

### Test requests

Get reactions for post:

```bash
curl -X GET "http://localhost:3000/posts/2020-04-12-use-redux-with-react-hooks/likes"
```

Set reaction to post:

```bash
curl -X POST -d "{\"reactionId\":\"love\"}" "http://localhost:3000/posts/2020-04-12-use-redux-with-react-hooks/likes"
```

## Deploy lambda:

```bash
npm run deploy

# You get endpoints, like that
# https://ddc5ofqqm0.execute-api.us-east-2.amazonaws.com/dev/
```

## Tests

```bash
npm test
```
