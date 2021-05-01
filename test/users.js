const request = require('supertest')('https://reqres.in/');
const chai = require('chai');
const expect = require('chai').expect
chai.use(require('chai-string')); //for string check
chai.use(require('chai-like')); //for array like things
chai.use(require('chai-things')); //for something
chai.should() //for should

describe('reqres api validation', () => {
  it('GET /users', () => {
    return request.get('api/users').then((res) => {
      expect(res.body.total_pages).to.be.eq(2);
    });
  });
  it('GET /users/page=2', () => {

    return request.get('api/users?page=2').then((res) => {
      let data = res.body.data;

      var users = [];
      data.forEach(function(e){
            users.push(e.id);
      });
      usersLength = users.length;
      expect(res.body.page).to.be.eq(2); //validate page number
      expect(res.body.per_page).to.be.eq(usersLength); //validate number of users in each page
      expect(users).to.have.members([7,8,9,10,11,12]); //validate the users id
      expect(data).to.be.an('array').that.to.be.not.eq({"avatar":""}); //validate avataer in not equal blank
    });
  });

  it('GET /single_user', () => {

    return request.get('api/users/2').then((res) => {
      var value = res.body.data.email;
      expect(value).to.be.a('string'); //validate email should be string
      expect(res.body.data.avatar).to.endsWith(".jpg"); //validate imagepath ends with jpg
    });
  });


  it('GET /user_not_found', () => {
    return request.get('api/users/23').then((res) => {
      expect(res.status).to.be.eq(404);
      expect(res.body).to.deep.equal({}); //validate user not found
    });
  });

  it('GET /all_resources', () => {

    return request.get('api/unknown').then((res) => {
      let data = res.body.data;

      var pantone = [];
      data.forEach(function(e){
            pantone.push(e.pantone_value);
      });
      //console.log(pantone);
      expect(res.body.page).to.be.eq(1); //validate the page number
      pantone.forEach(function(e){
        expect(e).to.have.indexOf('-', 2); //validate pantone_value has '-'
      });
    });
  });

  

  it('GET /single_resouce', () => {

    return request.get('api/unknown/2').then((res) => {
      var value = res.body.data.color;
      //console.log(value);
      expect(value).to.startsWith('#'); //validate color starts with hash
      expect(res.body.support.url).to.startsWith('https'); //validate link or we can use chai-url
    });
  });

  it('GET /resouces_not_found', () => {

    return request.get('api/unknown/23').then((res) => {
      expect(res.status).to.be.eq(404);
      expect(res.body).to.deep.equal({}); //validate user not found
    });
  });

  
  it('POST /user', () => {
    let userDetails = {
      "name": "morpheus",
      "job": "leader"
    };
    return request
      .post('api/users')
      .send(userDetails)
      .then((res) => {
        expect(res.body.name).to.be.eq('morpheus') //validate the post with name
      });
  });

  it('PUT /user', () => {
    let userDetails = {
      "name": "morpheus",
      "job": "zion resident"
    };
    return request
      .put('api/users/2')
      .send(userDetails)
      .then((res) => {
        expect(res.body).to.have.property("updatedAt") //validate the update method with update time property
      });
  });

  it('PATCH /user', () => {
    let userDetails = {
      "name": "morpheus",
      "job": "zion resident"
    };
    return request
      .patch('api/users/2')
      .send(userDetails)
      .then((res) => {
        expect(res.body).to.have.property("job")
        .that.to.be.a("string") //validate the patch method body property
      });
  });

  it('DELETE /users', () => {
    return request
      .delete('api/users/2')
      .then((res) => {
        const data = res.body;
        expect(data).to.deep.equal({}); //validate delete user
      });
  });

  it('POST /register', () => {
    let data = {
      "email": "eve.holt@reqres.in",
      "password": "pistol"
    };
    return request
      .post('api/register')
      .send(data)
      .then((res) => {
        token = res.body.token;
        expect(res.status).to.be.eq(200); //validate the response code
        expect(res.body).to.have.property("token").with.lengthOf(17);  //validate the token length for user 
      });
  });

  it('POST /register', () => {
    let data = {
      "email": "eve.holt@reqres.in",
    };
    return request
      .post('api/register')
      .send(data)
      .then((res) => {
        expect(res.status).to.be.eq(400);
        expect(res.body.error).to.be.eq("Missing password"); //validate the registration failed with message
      });
  });

  it('POST /login', () => {
    let data = {
      "email": "eve.holt@reqres.in",
      "password": "pistol"
    };
    return request
      .post('api/login')
      .send(data)
      .then((res) => {
        expect(res.status).to.be.eq(200);
        expect(res.body.token).to.be.eq(token); //validate the token generated while register and while login
      });
  });

  it('POST /login', () => {
    let data = {
      "email": "peter@klaven",
    };
    return request
      .post('api/login')
      .send(data)
      .then((res) => {
        expect(res.status).to.be.eq(400);
        expect(res.body.error).to.be.eq("Missing password"); //validate login fail with message
      });
  });

  it('GET /Delayed Response', () => {

    return request.get('api/users?delay=3').then((res) => {
      let data = res.body.data;

      var email = [];
      data.forEach(function(e){
            email.push(e.email);
      });
      //console.log(pantone);
      expect(res.body.page).to.be.eq(1); //validate the page number
      email.forEach(function(e){
        expect(e).endsWith(".in"); //validate email ends with '.in''
      });
    });
  });


});