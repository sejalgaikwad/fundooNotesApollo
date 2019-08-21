const chai = require('chai');
const expect = chai.expect;
const test = require('supertest')
const fs = require("fs")
var access_token = "";

function test1() {
    var data = fs.readFileSync('test/data.json');
    var data1 = JSON.parse(data);
    return data1;
}

describe('Register and Login', () => {

    it("register", (done) => {
        test(process.env.URL)
            .post('/graphql')
            .send({
                query: test1().register
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                expect(JSON.parse(res.text).data.register.success).to.be.true
                done();
            })
    })
})

it('login', (done) => {
    test(process.env.URL)
        .post('/graphql')
        .send({
            query: test1().login
        })
        .expect(200)
        .end((err, res) => {

            if (err) {
                return done(err)
            }
            expect(JSON.parse(res.text).data.login.success).to.be.true
            //console.log(JSON.parse(res.text).data.login.token)
            console.log(access_token);
            done();
        })
});

/***********************************LABELS TEST***********************************************/

describe('Labels', () => {

    it('login', (done) => {
        test(process.env.URL)
            .post('/graphql')
            .send({
                query: test1().login
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                expect(JSON.parse(res.text).data.login.success).to.be.true
                //console.log(JSON.parse(res.text).data.login.token)
                access_token = JSON.parse(res.text).data.login.token;
                console.log(access_token);
                done();
            })
    });


    it('createLabel', (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({
                "token": access_token
            })
            .send({
                query: test1().createLabel
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                expect(JSON.parse(res.text).data.createLabel.success).to.be.true
                done();
            })
    });


    it('updateLabel', (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({
                "token": access_token
            })
            .send({
                query: test1().updateLabel
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                expect(JSON.parse(res.text).data.updateLabel.success).to.be.true
                done();
            })
    });

    it('removeLabel', (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({
                "token": access_token
            })
            .send({
                query: test1().removeLabel
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                expect(JSON.parse(res.text).data.removeLabel.success).to.be.true
                done();
            })
    });

})

/***********************************NOTES TEST***********************************************/

describe("Notes", () => {
    it("createNote", (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({
                "token": access_token
            })
            .send({
                query: test1().createNote
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(JSON.parse(res.text).data.createNote.success).to.be.true
                done();
            })
    })

    it("updateNote", (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({
                "token": access_token
            })
            .send({
                query: test1().updateNote
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(JSON.parse(res.text).data.updateNote.success).to.be.true
                done();
            })
    })

    it("removeNote", (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({
                "token": access_token
            })
            .send({
                query: test1().removeNote
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(JSON.parse(res.text).data.removeNote.success).to.be.true
                done();
            })
    })

    it("Add Reminder", (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({
                "token": access_token
            })
            .send({
                query: test1().addReminder
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(JSON.parse(res.text).data.addReminder.success).to.be.true
                done();
            })
    })

    it("archive", (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({
                "token": access_token
            })
            .send({
                query: test1().archive
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(JSON.parse(res.text).data.archive.success).to.be.true
                done();
            })
    })

    it("unarchive", (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({
                "token": access_token
            })
            .send({
                query: test1().unarchive
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(JSON.parse(res.text).data.unarchive.success).to.be.true
                done();
            })
    })

    it("trash", (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({
                "token": access_token
            })
            .send({
                query: test1().trash
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(JSON.parse(res.text).data.trash.success).to.be.true
                done();
            })
    })

    it("untrash", (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({
                "token": access_token
            })
            .send({
                query: test1().untrash
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(JSON.parse(res.text).data.untrash.success).to.be.true
                done();
            })
    })
})


/***********************************GITS TEST***********************************************/

describe("GITS TESTS", () => {
    
    it("createBranch", (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({
                "token": access_token
            })
            .send({
                query: test1().createBranch
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(JSON.parse(res.text).data.createBranch.success).to.be.true
                done();
            })
    })

    it("deleteBranch", (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({
                "token": access_token
            })
            .send({
                query: test1().deleteBranch
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(JSON.parse(res.text).data.deleteBranch.success).to.be.true
                done();
            })
    })

    it("watchRepository", (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({
                "token": access_token
            })
            .send({
                query: test1().watchRepository
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(JSON.parse(res.text).data.watchRepository.success).to.be.true
                done();
            })
    })

    it("unwatchRepository", (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({
                "token": access_token
            })
            .send({
                query: test1().unwatchRepository
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(JSON.parse(res.text).data.unwatchRepository.success).to.be.true
                done();
            })
    })

    it("starRepository", (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({
                "token": access_token
            })
            .send({
                query: test1().starRepository
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(JSON.parse(res.text).data.starRepository.success).to.be.true
                done();
            })
    })

    it("unstarRepository", (done) => {
        test(process.env.URL)
            .post('/graphql')
            .query({
                "token": access_token
            })
            .send({
                query: test1().unstarRepository
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(JSON.parse(res.text).data.unstarRepository.success).to.be.true
                done();
            })
    })



it("removeCollaborator", (done) => {
    test(process.env.URL)
        .post('/graphql')
        .query({
            "token": access_token
        })
        .send({
            query: test1().removeCollaborator
        })
        .expect(200)
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            expect(JSON.parse(res.text).data.removeCollaborator.success).to.be.true
            done();
        })
})



it("addCollaborator", (done) => {
    test(process.env.URL)
        .post('/graphql')
        .query({
            "token": access_token
        })
        .send({
            query: test1().addCollaborator
        })
        .expect(200)
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            expect(JSON.parse(res.text).data.addCollaborator.success).to.be.true
            done();
        })
})

})