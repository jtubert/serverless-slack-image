const Jimp = require('jimp');
require('dotenv').config();

runLocal();

async function runLocal(){
  const event = {queryStringParameters:{category: "CAREERS AND MOTIVATION", color: "18A63F", text: "Qual é a importância em ter a mesma religião e valores ao criar um filho com alguém?"}};
  const holder = await entrypoint(event);

  const image = await holder.writeAsync("./cards/test.png");

  console.log("Saved in " + "./cards/test.png");
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



//CONVERT FONT
//https://www.71squared.com/ (BEST but paid)
//https://ttf2fnt.com/ 
//https://cloudconvert.com/otf-to-ttf

//Jimp.FONT_SANS_32_WHITE);
//https://github.com/oliver-moran/jimp/tree/master/packages/plugin-print/fonts

async function createCard(category, color, text){
  const w = 564;
  const h = 789;
  const left = 60;
  const top = 60;
  const holder = await new Jimp(w, h, color);
  //const font24 = await Jimp.loadFont("https://raw.githubusercontent.com/jtubert/serverless-slack-image/master/fonts/HelveticaNeueLTStd-Bd-white-24/HelveticaNeueLTStd-Bd.ttf.fnt");
  //const font50 = await Jimp.loadFont("https://raw.githubusercontent.com/jtubert/serverless-slack-image/master/fonts/HelveticaNeueLTStd-Bd-white-50/HelveticaNeueLTStd-Bd.ttf.fnt");
  const font50 = await Jimp.loadFont("./fonts/white50.fnt");
  const font24 = await Jimp.loadFont("./fonts/white24.fnt");
  holder.print(font50, left, top, text, w-(left*2));
  holder.print(font24, left, 700, category, w-(left*2));
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
    accessKeyId: process.env.accessKeyId, 
    secretAccessKey: process.env.secretAccessKey,
    region: process.env.region
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