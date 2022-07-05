// node는 CommomJS 문법을 사용
// import require()
const http = require('http');
// 본인컴퓨터의 주소를 의미함 127.0.0.1
const hostname = "127.0.0.1";
const port = 8080;

// 서버만들기 createServer(f(req, res))
const server = http.createServer(function(req,res){
    // 요청정보 req
    // 응답해줄게 res
    // console.log(req);
    const path = req.url;
    const method = req.method;
    if (path === "/products") {
        if (method === "GET") {
            // 응답을 보낼 때 타입을 제이슨 객체를 헤더에 보낼거야
            res.writeHead(200, {'Content-Type': 'application/json'})
            // js 배열을 json형태로 변경해서 products에 담기
            const products =  JSON.stringify([
                {
                    name: "거실조명",
                    price: 50000,
                },
                {
                    name: "어린이조명",
                    price: 50000,
                }
            ])
            res.end(products);
        }
    }
    console.log(path);
    console.log(method);
    res.end("Hello Client");
})

// listen은 대기 호스트네임과 포트번호로 요청을 기다림
server.listen(port, hostname);
console.log('조명쇼핑몰 서버가 돌아가고 있습니다.');