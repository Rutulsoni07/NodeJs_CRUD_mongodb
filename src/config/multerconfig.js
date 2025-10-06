const multer = require('multer')
const path = require('path')

// const upload = multer({dest:"public/image"})

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
   cb(null,path.join(__dirname,"..","..","public","image"))
    },
    filename:(req,file,cb)=>{
        const preFix = Date.now()+ "-" + Math.ceil(Math.random()*10000)
        cb(null, preFix+"-"+file.originalname)
    }
})

const upload = multer({storage : storage})

module.exports = upload