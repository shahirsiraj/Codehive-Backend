const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded(
    { extended: true }
    )
)
app.use(express.json());
app.use(methodOverride('_method'));

/////////////////////////////// IMPORT ROUTERS /////////////////////////////


///////////////////////////   API ENDPOINT ROUTES //////////////////////////

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentsRouter);

/////////////////////////////// LISTENER /////////////////////////////////
app.listen(port, () => {
    console.log('GitHive App running on port: ', port)
}
)