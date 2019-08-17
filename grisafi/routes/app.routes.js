let handler = require("../handler/apphandler");

module.exports = app =>{
    app.get("/members",(req,res)=>handler.getMembers(req,res));
    app.get("/members/:id",(req,res)=>handler.getMember(req,res));
    app.post("/members",(req,res)=>handler.postMember(req,res));

    app.get("/books",(req,res)=>handler.getBooks(req,res));
    app.get("/books/:id",(req,res)=>handler.getBookId(req,res));
    app.post("/books",(req,res)=>handler.postBook(req,res));
    app.delete("/books/:id",(req,res)=>handler.deleteBook(req,res));
    app.put("books/:id",(req,res)=>handler.putBook(req,res));

    app.get("/loans/",(req,res)=>handler.getLoans(req,res));
    app.get("/loans/:idMember", (req,res) => handler.getLoansMember(req,res));
    app.post("/loans",(req,res)=>handler.postLoan(req,res));
}