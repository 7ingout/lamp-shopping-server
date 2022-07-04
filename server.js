const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const models = require('./models');

// 업로드 이미지를 관리하는 스토리지 서버를 연결 -> multer를 사용하겠다
const multer = require("multer");
// 이미지 파일이 요청 오면 어디에 저장할건지 지정
const upload = multer({ 
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            // 어디에 저장할거냐? upload/
            cb(null, 'upload/')
        },
        filename: function(req, file, cb){
            // 어떤 이름으로 저장할거야?
            // file 객체의 오리지널 이름으로 저장하겠다.
            cb(null, file.originalname)
        }
    })
 })

// json형식의 데이터를 처리할 수 있게 설정
app.use(express.json());
// 브라우저 cors 이슈를 막기 위해 사용(모든 브라우저의 요청을 일정하게 받겠다)
app.use(cors());

// upload 폴더에 있는 파일에 접근할 수 있도록 설정
app.use("/upload", express.static("upload"));
// 요청처리
// app.메서드(url, 함수)
// 이미지파일이 post로 요청이 왔을 때 upload라는 폴더에 이미지를 저장하기
// 이미지가 하나일 때 single
app.post('/image', upload.single('image'), (req, res)=>{
    const file = req.file;
    console.log(file);
    res.send({
        imageUrl: "http://localhost:3000/"+file.destination+file.filename
    })
})


app.get('/products',async(req,res)=>{
    // 데이터베이스 조회하기
    models.Product.findAll()
    .then(result=> {
        // console.log("제품전체조회", result);
        res.send(result);
    })
    .catch(e=>{
        console.error(e)
        res.send("파일 조회에 문제가 있습니다.")
    })
})
// method는 get이고 오고 url은 /product/2 로 요청이 온 경우
app.get('/product/:id', async (req, res) => {
    const params = req.params;
    // const { id } = params;
    // 하나만 조회할때는 findDone -> select문
    models.Product.findOne({
        // 조건절
        where: {
            id: params.id
        }
    })
    .then(result=>{
        res.send(result);
    })
    .catch(e=>{
        console.log(e)
        res.send("상품 조회에 문제가 생겼습니다.")
    })
    // const product = {
    //     id: id,
    //     name: "서버에서 보내는 이름",
    //     price: 50000,
    //     imgsrc:"images/products/product4.jpg",
    //     seller: "green",
    // }
    // res.send(product);
});
// app.post('/green', async (req, res)=>{
//     console.log(req);
//     res.send('그린 게시판에 게시글이 등록되었습니다.');
// });

// 상품 등록
app.post("/products", (req, res)=> {
    // http body에 있는 데이터
    const body = req.body;
    // body객체에 있는 값을 각각 변수에 할당
    const { name, price, seller, imageUrl, description } = body;
    if(!name || !price || !seller) {
        res.send("모든 필드를 입력해주세요");
    }
    // Product테이블에 레코드를 삽입
    else {
        models.Product.create({
            name,
            price,
            seller,
            imageUrl,
            description
        }).then(result=>{
            console.log("상품 생성 결과 :", result);
            res.send({
                result
            })
        })
        .catch(e=>{
            console.error(e);
            res.send("상품 업로드에 문제가 생겼습니다.")
        })
    }
    
})
// delete 삭제하기
app.delete('/product/:id', async (req, res)=>{
    const params = req.params;
    models.Product.destroy({ where: {id: params.id} })
    .then( res.send("상품이 삭제되었습니다."))
}) 
// 실행
app.listen(port, ()=>{
    console.log('쇼핑몰 서버가 동작중입니다.');
    // sequelize와 데이터베이스 연결작업
    // 데이터베이스 동기화
    models.sequelize
    .sync()
    .then(()=> {
        console.log('DB연결 성공');
    })
    .catch(e=>{
        console.error(e);
        console.log('DB연결 에러');
        // 서버실행이 안되면 프로세서를 종료
        process.exit();
    })
})