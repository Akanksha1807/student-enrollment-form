var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var stdDBName = "Student-DB";
var stdRelName = "StudentData";
var connToken = "90931924|-31949299996418478|90960815"

$('#roll').focus();

function resetForm() {
    $('#roll').val("");
    $('#stuname').val("");
    $('#class').val("");
    $('#dob').val("");
    $('#address').val("");
    $('#doe').val("");
    $('#roll').prop("disabled", false);
    $('#save').prop("disabled", true);
    $('#change').prop("disabled", true);
    $('#reset').prop("disabled", true);
    $('#roll').focus();
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $('#stuname').val(data.stuname);
    $('#class').val(data.class);
    $('#dob').val(data.dob);
    $('#adress').val(data.address);
    $('#doe').val(data.doe);
}

function saveData()
{
    var jsonStrObj = validateData();
    if(jsonStrObj===''){
        return ""
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, stdDBName, stdRelName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $('#roll').focus();
}

function validateData()
{
    var roll, stuname, clas1, dob, address, doe;
    roll = $('#roll').val();
    stuname = $('#stuname').val();
    clas1 = $('#class').val();
    dob = $('#dob').val();
    address = $('#address').val();
    doe = $('#doe').val();

    if(roll === "")
    {
        alert("Roll no missing");
        $('#roll').focus();
        return '';
    }
    if(stuname === "")
    {
        alert("Student name missing");
        $('#stuname').focus();
        return '';
    }
    if(clas1 === "")
    {
        alert("Class missing");
        $('#class').focus();
        return '';
    }
    if(dob === "")
    {
        alert("Date of Birth missing");
        $('#dob').focus();
        return '';
    }
    if(address === "")
    {
        alert("Adress missing");
        $('#adress').focus();
        return '';
    }
    if(doe === "")
    {
        alert("Date of enrolment missing");
        $('#doe').focus();
        return '';
    }

    var jsonStrObj = {
        roll: roll,
        name: stuname,
        class: clas1,
        dob: dob,
        address: address,
        doe: doe
    };
    return JSON.stringify(jsonStrObj);
}
function saveRecNo2LS(jsonObj)
{
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}
function changeData()
{
    $('#change').prop('disabled', true);
    jsonChg = validateData();
    console.log(localStorage.getItem('recno'))
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stdDBName,stdRelName, localStorage.getItem('recno') )
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $('#roll').focus();
}

function getstudent()
{
    var rollJsonObj = getrollAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, stdDBName, stdRelName, rollJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if(resJsonObj.status ===400)
    {
        $('#save').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $("#stuname").focus();
    }
    else if(resJsonObj.status === 200)
    {
        $("#roll").prop("disabled", true);
        fillData(resJsonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#stuname").focus();
    }
}

function getrollAsJsonObj()
{
    var roll = $('#roll').val();
    var jsonStr = {
        id:roll
    };
    return JSON.stringify(jsonStr);
}