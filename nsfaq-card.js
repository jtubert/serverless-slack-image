const Jimp = require('jimp');
require('dotenv').config();

//runLocal();

async function runLocal(){
  const holder = await entrypoint({queryStringParameters:{category: "category", color: "FF0000", text: "What is your name?"}});

  const image = await holder.writeAsync("./resized/test.png");

  console.log("Saved in " + "./resized/test.png");
}

//curl -H "Accept: image/png" https://u9pwl8bl3i.execute-api.us-east-1.amazonaws.com/dev/nsfaq-card > card.png


module.exports.myfunc = async event => {
  const holder = await entrypoint(event);
  const buffer = await holder.getBufferAsync(Jimp.MIME_PNG);

  const response = {
   statusCode: 200,
   headers: {"Content-Type": "image/png"},
   body: buffer.toString('base64'),
     isBase64Encoded: true
   };

  return response;
};

async function entrypoint(event){
  try {
    let category="CAREERS AND MOTIVATION";
    let color = "18A63F";
    let text = "Do you feel that everyone should openly disclose their salary? Why or why not?";

    if(event && event.queryStringParameters && event.queryStringParameters.category){
      category = event.queryStringParameters.category;
    }

    if(event && event.queryStringParameters && event.queryStringParameters.color){
      color = event.queryStringParameters.color;
    }

    if(event && event.queryStringParameters && event.queryStringParameters.text){
      text = event.queryStringParameters.text;
    }
    const buffer = await createCard(category, color, text);

    return buffer;
    
  } catch(err) {
    dumpError(err);
    return 'Error: ' + err;
  }
}

async function createCard(category, color, text){
  const w = 564;
  const h = 789;
  const left = 30;
  const top = 30;
  const holder = await new Jimp(w, h, color);
  //https://github.com/oliver-moran/jimp/tree/master/packages/plugin-print/fonts
  const font32 = await Jimp.loadFont("https://raw.githubusercontent.com/oliver-moran/jimp/master/packages/plugin-print/fonts/open-sans/open-sans-64-white/open-sans-64-white.fnt");//Jimp.FONT_SANS_32_WHITE);
  const font16 = await Jimp.loadFont("https://raw.githubusercontent.com/oliver-moran/jimp/master/packages/plugin-print/fonts/open-sans/open-sans-16-white/open-sans-16-white.fnt");
  holder.print(font32, left, top, text, w-(left*2));
  holder.print(font16, left, 700, category, w-(left*2));
  return holder;
}

/*
async function uploadBufferToS3(buffer, filename, location){
  console.log("uploadBufferToS3");
  
  // call S3 to retrieve upload file to specified bucket
  let uploadParams = {Bucket: 'oneamerica-site', Key: '', Body: ''};
  uploadParams.Body = buffer;
  uploadParams.Key = filename;
  // call S3 to retrieve upload file to specified bucket


  AWS.config.update({
    accessKeyId: 'AKIAQTKQ4B5NWOP263HB', 
    secretAccessKey: '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',
    region: 'us-east-1'
  });
  // Create S3 service object
  const s3 = new AWS.S3({apiVersion: '2006-03-01'});

  const upload = util.promisify(s3.upload).bind(s3);
  return await upload(uploadParams);
  

  return msg;
}
*/

function dumpError(err) {
  if (typeof err === 'object') {
    if (err.message) {
      console.log('\nMessage: ' + err.message)
    }
    if (err.stack) {
      console.log('\nStacktrace:')
      console.log('====================')
      console.log(err.stack);
    }
  } else {
    console.log('dumpError :: argument is not an object');
  }
}