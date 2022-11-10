const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const app = express();

const Student = require('./models/student');


app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');


const goToDashBoard = async (req, res) => {
    try {
        const [allLocations] = await Student.getAllDistinctLocations();

        res.render('dashboard', { allLocations: allLocations });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }
}

const allData = async (req, res) => {
    try {
        const [allLocations] = await Student.getAllDistinctLocations();
        var passedStudents = {}, failedStudents = {};
        for (var i = 0; i < allLocations.length; i++) {
            const [noOfPassedStudents] = await Student.getNoOfPassedStudents(allLocations[i].allDistinctLocations);

            passedStudents[allLocations[i].allDistinctLocations] = noOfPassedStudents[0].noOfPassedStudents;

            const [noOfFailedStudents] = await Student.getNoOfFailedStudents(allLocations[i].allDistinctLocations);

            failedStudents[allLocations[i].allDistinctLocations] = noOfFailedStudents[0].noOfFailedStudents;
        }
        const [noOfPassedStudents] = await Student.getNoOfPassedStudents("");
        passedStudents['All'] = noOfPassedStudents[0].noOfPassedStudents;

        const [noOfFailedStudents] = await Student.getNoOfFailedStudents("");
        failedStudents['All'] = noOfFailedStudents[0].noOfFailedStudents;

        res.send({ allLocations: allLocations, passedStudents: passedStudents, failedStudents: failedStudents });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }
}

app.get('/', goToDashBoard);

app.get('/getAllData', allData);

app.listen(3000);
