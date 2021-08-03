const express = require("express")
const Http = require("http")
const cors = require("cors")
const router = require("./routers/router")
const cookieparser = require("cookie-parser")
const nunjucks = require("nunjucks");
const socketIO = require("./socket");
const session = require("express-session");
require('dotenv').config();
const port = 4001;

const app = express()
const http = Http.createServer(app)

app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
})

app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.use(cookieparser())
app.use(cors({
    // 맨 뒤에 .shop/중에서 /를 삭제해야 사용할 수 있다.
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(
    session({
        resave: false, // Session 재저장 여부
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET, // Session 암호화 Key
        rolling: true, // 로그인 상태에서 페이지 이동 시마다 Session값 변경 여부
        cookie: {
            httpOnly: true,
            secure: false,
        },
    })
);

app.use("/api", router)


// app.get('/', (req, res) => {
//     res.render("maps");
// });
//
// app.get('/multimarker', (req, res) => {
//     res.render("maps_multiMarker");
// });
//
// app.get('/multiimagemarker', (req, res) => {
//     res.render("maps_multiImageMarker");
// });
//
// app.get('/multimarkercontrol', (req, res) => {
//     res.render("maps_multiMarkerControl");
// });
//
// app.get('/multimarkerevent1', (req, res) => {
//     res.render("maps_multiMarkerEvent_1");
// });
//
// app.get('/multimarkerevent2', (req, res) => {
//     res.render("maps_multiMarkerEvent_2");
// });
//
// app.get('/socketmaps', (req, res) => {
//     res.render("socket_maps")
// });
//
// app.get('/room', (req, res) => {
//     res.render("main_room")
// });
// app.get('/room/my', (req, res) => {
//     res.render("main_room_my")
// });
//
// app.get('/chat/:postId', (req, res) => {
//     res.render("chat", {postId: req.params.postId})
// });


const server = http.listen(port, () => {
    console.log(`localhost:  http://localhost:${port}`);
})


socketIO(server, app);

module.exports = http