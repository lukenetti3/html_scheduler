const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

var currentUtcTime = new Date(); // This is in UTC

// Converts the UTC time to a locale specific format, including adjusting for timezone.
var currentDateTime = new Date(currentUtcTime.toLocaleString('en-US', { timeZone: timeZone }));

console.log('currentDateTime: ' ,        currentDateTime.toLocaleDateString());
console.log('currentDateTime Year: ' , currentDateTime.getFullYear());
console.log('currentDateTime Month: ' , parseInt(currentDateTime.getMonth())+1);
console.log('currentDateTime Date: ' , currentDateTime.getDate());
console.log('currentDateTime Hour: ' , currentDateTime.getHours());
console.log('currentDateTime Minute: ' , currentDateTime.getMinutes());

var cYear = currentDateTime.getFullYear()
var cMonth = currentDateTime.getMonth() + 1
var cDate = currentDateTime.getDate()
var cHour = currentDateTime.getHours()
var cMin = currentDateTime.getMinutes()
var cDay = 0

var wDates = new Date(cYear, cMonth, 0).getDate()

var lastWDates = 0
var lastMonth = 0
var lastDate = 0
var pageIndex = 0

var selectedTimes = []
var selectedTimesLength = 0

//In iteration, for retrieving the original date
cDate = cDate - 1

createStateSelect()
createServiceSelect()
createCustomerSelect()

for (var i = 0; i < 5; i++) {
    if (cDate < wDates) {
        cDate = cDate + 1
    } else {
        cMonth += 1
        cDate = 1
    }
    // cDay = new Date(cYear, cMonth-1, cDate).getDay()
    // console.log('cDay : ', cDay, cDay.getDay())
    curWeek(cMonth, cDate, i)
    lastMonth = cMonth
    lastDate = cDate
    lastWDates = new Date(cYear, lastMonth, 0).getDate()
}

function parseISO8601String(dateString) {
    var timebits = /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})(?::([0-9]*)(\.[0-9]*)?)?(?:([+-])([0-9]{2})([0-9]{2}))?/;
    var m = timebits.exec(dateString);
    var resultDate;
    if (m) {
        var utcdate = Date.UTC(parseInt(m[1]),
                               parseInt(m[2])-1, // months are zero-offset (!)
                               parseInt(m[3]),
                               parseInt(m[4]), parseInt(m[5]), // hh:mm
                               (m[6] && parseInt(m[6]) || 0),  // optional seconds
                               (m[7] && parseFloat(m[7])*1000) || 0); // optional fraction
        // utcdate is milliseconds since the epoch
        if (m[9] && m[10]) {
            var offsetMinutes = parseInt(m[9]) * 60 + parseInt(m[10]);
            utcdate += (m[8] === '+' ? -1 : +1) * offsetMinutes * 60000;
        }
        resultDate = new Date(utcdate);
    } else {
        resultDate = null;
    }
    return resultDate;
}

async function curWeek(currMonth, currDate, i) {
    await document.querySelector("#scheduleUl").insertAdjacentHTML(
        "beforeend",
        `<li id="scheduleLi${currMonth}_${currDate}" tabindex="-1" class="Date-Option set Item${
            i * 5 + 1
        } active ${
            mobileCheck() && i === 0 ? "current-day" : null
        }" data-row="${i * 5 + 1}" data-results="75" 
            onclick="${
                mobileCheck()
                    ? "handleMobileScheduleDay(" +
                      `${currMonth}` +
                      "," +
                      `${currDate}` +
                      ")"
                    : null
            }"></li>`
    )
    await document
        .querySelector(`#scheduleLi${currMonth}_${currDate}`)
        .insertAdjacentHTML(
            "beforeend",
            `<div id="scheduleDiv${currMonth}_${currDate}" class="date-container"></div>`
        )
    await document
        .querySelector(`#scheduleDiv${currMonth}_${currDate}`)
        .insertAdjacentHTML(
            "beforeend",
            `<strong>${currMonth}/${currDate}</strong>`
        )
    await document
        .querySelector(`#scheduleDiv${currMonth}_${currDate}`)
        .insertAdjacentHTML(
            "beforeend",
            `<strong>${
                aDays[new Date(cYear, currMonth - 1, currDate).getDay()]
            }</strong>`
        )
    await document
        .querySelector(`#scheduleLi${currMonth}_${currDate}`)
        .insertAdjacentHTML(
            "beforeend",
            `<ul id='scheduleChildUl${currMonth}_${currDate}' tabindex="-1" class="slots"></ul>`
        )
    await document
        .querySelector(`#scheduleChildUl${currMonth}_${currDate}`)
        .insertAdjacentHTML(
            "beforeend",
            `<li id="scheduleChildLi${currMonth}_${currDate}_${i}_1" tabindex="-1" class=""></li>`
        )
    await document
        .querySelector(`#scheduleChildUl${currMonth}_${currDate}`)
        .insertAdjacentHTML(
            "beforeend",
            `<li id="scheduleChildLi${currMonth}_${currDate}_${i}_2" tabindex="-1" class=""></li>`
        )
    await document
        .querySelector(`#scheduleChildUl${currMonth}_${currDate}`)
        .insertAdjacentHTML(
            "beforeend",
            `<li id="scheduleChildLi${currMonth}_${currDate}_${i}_3" tabindex="-1" class=""></li>`
        )
    await document
        .querySelector(`#scheduleChildUl${currMonth}_${currDate}`)
        .insertAdjacentHTML(
            "beforeend",
            `<li id="scheduleChildLi${currMonth}_${currDate}_${i}_4" tabindex="-1" class=""></li>`
        )
    await document
        .querySelector(`#scheduleChildUl${currMonth}_${currDate}`)
        .insertAdjacentHTML(
            "beforeend",
            `<li id="scheduleChildLi${currMonth}_${currDate}_${i}_5" tabindex="-1" class=""></li>`
        )
    await document
        .querySelector(`#scheduleChildLi${currMonth}_${currDate}_${i}_1`)
        .insertAdjacentHTML(
            "beforeend",
            `<input type="checkbox" required="required" id="scheduleChildInput${currMonth}_${currDate}_${i}_1" onclick="handleTimeSelect(event)" />`
        )
    await document
        .querySelector(`#scheduleChildLi${currMonth}_${currDate}_${i}_1`)
        .insertAdjacentHTML(
            "beforeend",
            `<label id="scheduleChildLabel${currMonth}_${currDate}_${i}_1" for="scheduleChildInput${currMonth}_${currDate}_${i}_1" title="${
                aMonths[currMonth - 1]
            } ${currDate}, ${cYear} 8:00 AM - 10:00 AM" tabindex='0' class="${
                cHour >= 10 && currentDateTime.getDate() === currDate ? "unavailable" : ""
            }">8:00 AM - 10:00 AM</label>`
        )
    await document
        .querySelector(`#scheduleChildLabel${currMonth}_${currDate}_${i}_1`)
        .insertAdjacentHTML(
            "beforeend",
            '<span class="hide">Call For Service</span>'
        )
    await document
        .querySelector(`#scheduleChildLi${currMonth}_${currDate}_${i}_2`)
        .insertAdjacentHTML(
            "beforeend",
            `<input type="checkbox" required="required" id="scheduleChildInput${currMonth}_${currDate}_${i}_2" onclick="handleTimeSelect(event)" />`
        )
    await document
        .querySelector(`#scheduleChildLi${currMonth}_${currDate}_${i}_2`)
        .insertAdjacentHTML(
            "beforeend",
            `<label id="scheduleChildLabel${currMonth}_${currDate}_${i}_2" for="scheduleChildInput${currMonth}_${currDate}_${i}_2" title="${
                aMonths[currMonth - 1]
            } ${currDate}, ${cYear} 10:00 AM - 12:00 PM" tabindex='0' class="${
                cHour >= 12 && currentDateTime.getDate() === currDate ? "unavailable" : ""
            }">10:00 AM - 12:00 PM</label>`
        )
    await document
        .querySelector(`#scheduleChildLabel${currMonth}_${currDate}_${i}_2`)
        .insertAdjacentHTML(
            "beforeend",
            '<span class="hide">Call For Service</span>'
        )

    await document
        .querySelector(`#scheduleChildLi${currMonth}_${currDate}_${i}_3`)
        .insertAdjacentHTML(
            "beforeend",
            `<input type="checkbox" required="required" id="scheduleChildInput${currMonth}_${currDate}_${i}_3" onclick="handleTimeSelect(event)" />`
        )
    await document
        .querySelector(`#scheduleChildLi${currMonth}_${currDate}_${i}_3`)
        .insertAdjacentHTML(
            "beforeend",
            `<label id="scheduleChildLabel${currMonth}_${currDate}_${i}_3" for="scheduleChildInput${currMonth}_${currDate}_${i}_3" title="${
                aMonths[currMonth - 1]
            } ${currDate}, ${cYear} 12:00 PM - 2:00 PM" tabindex='0' class="${
                cHour >= 14 && currentDateTime.getDate() === currDate ? "unavailable" : ""
            }">12:00 PM - 2:00 PM</label>`
        )
    await document
        .querySelector(`#scheduleChildLabel${currMonth}_${currDate}_${i}_3`)
        .insertAdjacentHTML(
            "beforeend",
            '<span class="hide">Call For Service</span>'
        )
    await document
        .querySelector(`#scheduleChildLi${currMonth}_${currDate}_${i}_4`)
        .insertAdjacentHTML(
            "beforeend",
            `<input type="checkbox" required="required" id='scheduleChildInput${currMonth}_${currDate}_${i}_4' onclick="handleTimeSelect(event)" />`
        )
    await document
        .querySelector(`#scheduleChildLi${currMonth}_${currDate}_${i}_4`)
        .insertAdjacentHTML(
            "beforeend",
            `<label id="scheduleChildLabel${currMonth}_${currDate}_${i}_4" for="scheduleChildInput${currMonth}_${currDate}_${i}_4" title="${
                aMonths[currMonth - 1]
            } ${currDate}, ${cYear} 2:00 PM - 4:00 PM" tabindex='0' class="${
                cHour >= 16 && currentDateTime.getDate() === currDate ? "unavailable" : ""
            }">2:00 PM - 4:00 PM</label>`
        )
    await document
        .querySelector(`#scheduleChildLabel${currMonth}_${currDate}_${i}_4`)
        .insertAdjacentHTML(
            "beforeend",
            '<span class="hide">Call For Service</span>'
        )

    await document
        .querySelector(`#scheduleChildLi${currMonth}_${currDate}_${i}_5`)
        .insertAdjacentHTML(
            "beforeend",
            `<input type="checkbox" required="required" id="scheduleChildInput${currMonth}_${currDate}_${i}_5" onclick="handleTimeSelect(event)" />`
        )
    await document
        .querySelector(`#scheduleChildLi${currMonth}_${currDate}_${i}_5`)
        .insertAdjacentHTML(
            "beforeend",
            `<label id="scheduleChildLabel${currMonth}_${currDate}_${i}_5" for="scheduleChildInput${currMonth}_${currDate}_${i}_5" title="${
                aMonths[currMonth - 1]
            } ${currDate}, ${cYear} 4:00 PM - 6:00 PM" tabindex='0' class="${
                cHour >= 18 && currentDateTime.getDate() === currDate ? "unavailable" : ""
            }">4:00 PM - 6:00 PM</label>`
        )
    await document
        .querySelector(`#scheduleChildLabel${currMonth}_${currDate}_${i}_5`)
        .insertAdjacentHTML(
            "beforeend",
            '<span class="hide">Call For Service</span>'
        )
}
async function prevWeek() {
    pageIndex--
    lastDate -= 10

    if (lastDate < 1) {
        lastMonth--
        lastWDates = new Date(cYear, lastMonth, 0).getDate()
        lastDate = lastWDates + lastDate
    }

    document.querySelector("#nextBtn").classList.add("active")
    document.querySelector("#scheduleUl").innerHTML = ""

    if (pageIndex === 0) {
        document.querySelector("#prevBtn").classList.remove("active")
    }

    for (var i = 0; i < 5; i++) {
        if (lastDate < lastWDates) {
            lastDate = lastDate + 1
        } else {
            lastMonth += 1
            lastDate = 1
        }
        await curWeek(lastMonth, lastDate, i)
    }

    Array.prototype.forEach.call(selectedTimes, function (element) {
        if (document.querySelector(`#${element.id}`))
            document.querySelector(`#${element.id}`).checked = true
    })
}
async function nextWeek() {
    pageIndex++

    document.querySelector("#prevBtn").classList.add("active")
    document.querySelector("#scheduleUl").innerHTML = ""

    if (pageIndex > 3) {
        document.querySelector("#nextBtn").classList.remove("active")
    }

    for (var i = 0; i < 5; i++) {
        if (lastDate < lastWDates) {
            lastDate = lastDate + 1
        } else {
            lastMonth += 1
            lastDate = 1
        }
        await curWeek(lastMonth, lastDate, i)
    }

    Array.prototype.forEach.call(selectedTimes, function (element) {
        if (document.querySelector(`#${element.id}`))
            document.querySelector(`#${element.id}`).checked = true
    })
}
function createStateSelect() {
    stateValues.forEach((val, index) => {
        var option = document.createElement("option")
        option.value = stateKeys[index]
        option.text = val
        document
            .querySelector("#SchedulerLocalContactForm_ITM0_State")
            .appendChild(option)
    })
}
function createServiceSelect() {
    serviceValues.forEach((val, index) => {
        var option = document.createElement("option")
        option.value = serviceKeys[index]
        option.text = val
        document
            .querySelector("#SchedulerLocalContactForm_ITM0_ServiceType")
            .appendChild(option)
    })
}
function createCustomerSelect() {
    customerValues.forEach((val, index) => {
        var option = document.createElement("option")
        option.value = customerKeys[index]
        option.text = val
        document
            .querySelector("#SchedulerLocalContactForm_ITM0_LeadTypeID")
            .appendChild(option)
    })
}
function handleNext() {
    if (selectedTimes.length === 0) {
        Toastify({
            text: "Please Select A Time of Service.",
            duration: 5000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "#e74c3c",
            stopOnFocus: true, // Prevents dismissing of toast on hover
            onClick: function () {}, // Callback after click
        }).showToast()
        selectedTimes = []
        return
    }
    document.querySelector("#mainSchedule").classList.remove("active")
    document.querySelector("#confirmSchedule").classList.add("active")
}
function handlePrev() {
    document.querySelector("#confirmSchedule").classList.remove("active")
    document.querySelector("#mainSchedule").classList.add("active")
}
function handleValidate(event) {
    if (event.target.value === "") {
        event.target.parentNode.parentNode.classList.remove("valid", "filled")
        event.target.parentNode.parentNode.classList.add("invalid")
    } else {
        event.target.parentNode.parentNode.classList.remove("invalid")
        event.target.parentNode.parentNode.classList.add("valid", "filled")
    }
}
function handleTimeSelect(event) {
    if (event.target.checked) selectedTimes.push(event.target)
    else {
        for (var i = 0; i < selectedTimes.length; i++) {
            if (selectedTimes[i].id === event.target.id)
                selectedTimes.splice(i, 1)
        }
    }

    if (selectedTimes.length > 2) {
        event.target.checked = false
        selectedTimes.pop()
    }
}
function handleMobileScheduleDay(month, day) {
    console.log(month, day)
    document
        .getElementsByClassName("current-day")[0]
        .classList.remove("current-day")
    document
        .querySelector(`#scheduleLi${month}_${day}`)
        .classList.add("current-day")
}
function handleRequest() {
    var time = []
    Array.prototype.forEach.call(selectedTimes, function (element) {
        filtered = element.id
            .replace(/\D+/g, " ")
            .trim()
            .split(" ")
            .map((e) => parseInt(e))
        time.push(
            cYear +
                "/" +
                filtered[0] +
                "/" +
                filtered[1] +
                "/" +
                scheduleTimes[3]
        )
    })
    const sch_firstName = document.querySelector(
        "#SchedulerLocalContactForm_ITM0_FirstName"
    ).value
    const sch_lastName = document.querySelector(
        "#SchedulerLocalContactForm_ITM0_LastName"
    ).value
    const sch_email = document.querySelector(
        "#SchedulerLocalContactForm_ITM0_EmailAddress"
    ).value
    const sch_phone = document.querySelector(
        "#SchedulerLocalContactForm_ITM0_Phone"
    ).value
    const sch_address = document.querySelector(
        "#SchedulerLocalContactForm_ITM0_Address"
    ).value
    const sch_city = document.querySelector(
        "#SchedulerLocalContactForm_ITM0_City"
    ).value
    const sch_state = document.querySelector(
        "#SchedulerLocalContactForm_ITM0_State"
    ).value
    const sch_zipCode = document.querySelector(
        "#SchedulerLocalContactForm_ITM0_ZipCode"
    ).value
    const sch_serviceType = document.querySelector(
        "#SchedulerLocalContactForm_ITM0_ServiceType"
    ).value
    const sch_leadTypeID = document.querySelector(
        "#SchedulerLocalContactForm_ITM0_LeadTypeID"
    ).value
    const sch_message = document.querySelector(
        "#SchedulerLocalContactForm_ITM0_Message"
    ).value

    var invalidFields = document.getElementsByClassName("invalid")
    if (invalidFields.length > 0) {
        Toastify({
            text: "Please correct in all fields.",
            duration: 5000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "#e74c3c",
            stopOnFocus: true, // Prevents dismissing of toast on hover
            onClick: function () {}, // Callback after click
        }).showToast()
        return
    }

    if (
        sch_firstName === "" ||
        sch_lastName === "" ||
        sch_email === "" ||
        sch_phone === "" ||
        sch_address === "" ||
        sch_city === "" ||
        sch_state === "" ||
        sch_zipCode === "" ||
        sch_serviceType === "" ||
        sch_leadTypeID === "" ||
        sch_message === ""
    ) {
        Toastify({
            text: "Please fill in all fields.",
            duration: 5000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "#e74c3c",
            stopOnFocus: true, // Prevents dismissing of toast on hover
            onClick: function () {}, // Callback after click
        }).showToast()
        return
    }

    // const emailTo = "emily@congruentstory.com"
    // const emailCC = "emily@congruentstory.com"
    const emailTo = "seniordev119@gmail.com"
    const emailCC = "seniordev119@gmail.com"
    const emailSub = "Schedule"
    const emailBody = `${time} \n FirstName: ${sch_firstName} \n LasttName: ${sch_lastName} \n Email: ${sch_email} \n Phone: ${sch_phone} \n Address: ${sch_address} \n City: ${sch_city} \n State: ${sch_state} \n ZipCode: ${sch_zipCode} \n ServiceType: ${sch_serviceType} \n LeadType: ${sch_leadTypeID} \n Message: ${sch_message}`

    window.open(
        "mailto:" +
            emailTo +
            "?cc=" +
            emailCC +
            "&subject=" +
            emailSub +
            "&body=" +
            encodeURIComponent(emailBody)
    )
}
function validateEmail(event) {
    var email = event.target.value
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var valid = re.test(String(email).toLowerCase())

    if (valid) {
        event.target.parentNode.parentNode.classList.remove("invalid")
        event.target.parentNode.parentNode.classList.add("valid", "filled")
    } else {
        event.target.parentNode.parentNode.classList.remove("valid", "filled")
        event.target.parentNode.parentNode.classList.add("invalid")
    }
}
function onlyNumberKey(evt) {
    // Only ASCII charactar in that range allowed
    var ASCIICode = evt.which ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false
    return true
}
function mobileCheck() {
    let check = false
    ;(function (a) {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4)
            )
        )
            check = true
    })(navigator.userAgent || navigator.vendor || window.opera)

    return check
}

document
    .getElementById("SchedulerLocalContactForm_ITM0_Phone")
    .addEventListener("input", function (e) {
        var x = e.target.value
            .replace(/\D/g, "")
            .match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
        e.target.value = !x[2]
            ? x[1]
            : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "")
    })
