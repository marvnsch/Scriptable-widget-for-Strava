// Map lineweight
const lineWeight = 2.5

// Widget Colors
const colorPalette = {
    dark: {
        backColor: '1D1C21',
        fillColor: 'FC4C02',
        textColor: 'EDEDED',
        textColor1: 'FC4C02',
        textColor2: '5B5A5E',
        mapColor: '000000'
    },
    light: {
        backColor: 'FFFFFF',
        fillColor: 'FC4C02',
        textColor: '1D1C21',
        textColor1: 'FC4C02',
        textColor2: '5B5A5E',
        mapColor: 'E6E6E6'
    }
}

//Widget Params, default values for debugging
let widgetInput = args.widgetParameter;

// Widget spacer
let timeSpacer = 0
let velSpacer = 0
let kudosSpacer = 0

// Supported workout types
const workoutTypeBike = "Ride";
const workoutTypeRun = "Run";

// Authentication link
const auth_link = "https://www.strava.com/oauth/token"

// Context initialization for the map
let drawContext = new DrawContext()
drawContext.respectScreenScale = true;
drawContext.opaque = false;

// Context initialization for the icon
let activityIcon = new DrawContext()
activityIcon.respectScreenScale = true;
activityIcon.opaque = false;

////////////////////////////////////////////////////////////////////////////////
//////////////////////////         App-Functions         ///////////////////////
////////////////////////////////////////////////////////////////////////////////

function drawActivityIcon(workout) {
    const canvSize = 60;
    activityIcon.size = new Size(canvSize, canvSize)
    if (workout.type === workoutTypeBike) {
        let frameLines = [[15.5, 27.1, 23, 12], [15.5, 27.1, 30, 27.1], [23, 12, 19.5, 5], [23, 12, 38.1, 12], [35.8, 6.3, 44.5, 27.1], [35.8, 6.3, 43, 6.3], [43, 6.3, 43, 8.5], [15.5, 5, 23.6, 5], [30, 27.1, 38.1, 12]]
        let OuterWheels = [[5, 17.6, 20, 20], [34.5, 17.6, 20, 20]]
        let offset = 8

        // Draw wheels
        activityIcon.setFillColor(getColor('fillColor'));
        activityIcon.setStrokeColor(getColor('fillColor'));
        activityIcon.setLineWidth(2);
        for (let i = 0; i < OuterWheels.length; i++) {
            let rec = new Rect(OuterWheels[i][0], OuterWheels[i][1] + offset, OuterWheels[i][2], OuterWheels[i][3])
            activityIcon.strokeEllipse(rec);
        }

        // Draw frame and sattle lines
        activityIcon.setFillColor(getColor('fillColor'));
        for (let i = 0; i < frameLines.length; i++) {
            let point1 = new Point(frameLines[i][0], frameLines[i][1] + offset)
            let point2 = new Point(frameLines[i][2], frameLines[i][3] + offset)
            drawLine(activityIcon, point1, point2, 2, getColor('fillColor'));
        }
    } else {
        let Outlines = [[5, 20.1], [5.2, 20.8], [5.3, 21.5], [5.6, 22.1], [5.8, 22.8], [6.1, 23.4], [6.3, 24.1], [6.7, 24.7], [7, 25.3], [7.4, 25.9], [7.8, 26.4], [8.2, 27], [8.6, 27.5], [9.1, 28], [9.7, 28.5], [10.2, 28.8], [10.8, 29.2], [11.5, 29.5], [12.1, 29.8], [12.7, 30.1], [13.4, 30.3], [14, 30.6], [14.7, 30.8], [15.3, 31.1], [16, 31.3], [16.6, 31.6], [17.3, 31.9], [17.9, 32.2], [18.5, 32.5], [19.1, 32.8], [19.7, 33.2], [20.3, 33.6], [20.9, 34], [21.4, 34.4], [21.9, 34.9], [22.4, 35.4], [22.9, 35.8], [23.4, 36.3], [23.9, 36.8], [24.4, 37.3], [24.9, 37.8], [25.4, 38.3], [25.9, 38.8], [26.4, 39.3], [26.9, 39.8], [27.4, 40.3], [27.9, 40.8], [28.4, 41.2], [28.9, 41.7], [29.5, 42.1], [30.1, 42.5], [30.7, 42.8], [31.3, 43.2], [31.9, 43.5], [32.5, 43.9], [33.1, 44.2], [33.7, 44.5], [34.3, 44.9], [35, 45.1], [35.6, 45.4], [36.3, 45.6], [36.9, 45.8], [37.6, 46], [38.3, 46.1], [39, 46.2], [39.7, 46.3], [40.4, 46.4], [41.1, 46.4], [41.7, 46.5], [42.4, 46.5], [43.1, 46.5], [43.8, 46.5], [44.5, 46.4], [45.2, 46.4], [45.9, 46.2], [46.6, 46.1], [47.3, 45.9], [47.9, 45.7], [48.6, 45.5], [49.2, 45.2], [49.9, 44.9], [50.5, 44.6], [51.1, 44.3], [51.7, 43.9], [52.2, 43.5], [52.8, 43], [53.3, 42.6], [53.8, 42.1], [54.2, 41.5], [54.6, 40.9], [54.9, 40.3], [55, 39.6], [54.7, 39], [54.2, 38.5], [53.7, 38.1], [53.1, 37.6], [52.5, 37.2], [52, 36.8], [51.4, 36.4], [50.9, 36], [50.3, 35.6], [49.7, 35.2], [49.2, 34.8], [48.6, 34.3], [48.1, 33.9], [47.5, 33.5], [47, 33], [46.4, 32.6], [45.9, 32.1], [45.4, 31.6], [45, 31.1], [44.5, 30.6], [44.1, 30], [43.7, 29.5], [43.3, 28.9], [43, 28.3], [42.6, 27.7], [42.3, 27], [42, 26.4], [41.7, 25.8], [41.4, 25.2], [41.1, 24.5], [40.8, 23.9], [40.5, 23.3], [40.3, 22.6], [40, 22], [39.7, 21.3], [39.4, 20.7], [39.2, 20.1], [38.9, 19.4], [38.7, 18.8], [38.4, 18.1], [38.1, 17.5], [37.8, 16.8], [37.7, 16.2], [37.5, 15.5], [37.4, 14.8], [37.3, 14.1], [37.2, 13.4], [37.2, 12.7], [37.1, 12], [37.1, 11.3], [37, 10.6], [36.9, 10], [36.6, 9.3], [36.2, 8.8], [35.6, 8.4], [34.9, 8.2], [34.2, 8.3], [33.6, 8.6], [33, 8.9], [32.3, 9.2], [31.7, 9.6], [31.2, 10], [30.6, 10.3], [30, 10.7], [29.4, 11], [28.8, 11.4], [28.1, 11.7], [27.5, 12], [26.9, 12.2], [26.2, 12.5], [25.5, 12.6], [24.8, 12.7], [24.1, 12.8], [23.4, 12.7], [22.8, 12.6], [22.1, 12.4], [21.5, 12.1], [20.9, 11.7], [20.5, 11.1], [20.3, 10.5], [20.1, 9.8], [19.9, 9.1], [19.7, 8.5], [19.5, 7.8], [19.2, 7.1], [19, 6.5], [18.7, 5.8], [18.3, 5.3], [17.7, 5], [17, 5.1], [16.4, 5.4], [15.8, 5.8], [15.3, 6.2], [14.8, 6.7], [14.3, 7.2], [13.8, 7.7], [13.3, 8.2], [12.8, 8.7], [12.4, 9.2], [11.9, 9.7], [11.5, 10.3], [11.1, 10.9], [10.7, 11.5], [10.4, 12], [10, 12.7], [9.7, 13.3], [9.4, 13.9], [9, 14.5], [8.7, 15.1], [8.4, 15.7], [8, 16.3], [7.7, 16.9], [7.3, 17.5], [6.8, 18], [6.2, 18.4], [5.6, 18.7], [5.1, 19.2], [5, 19.9]]
        let Inlines = [[38.9, 19.4, 32.5, 20.8], [40.5, 23.3, 34, 24.8], [42.3, 27, 35.4, 28.6]]
        let dataPointsToShow = Outlines.length

        // Draw outlines for the shoe
        activityIcon.setFillColor(getColor('fillColor'));
        for (let i = (dataPointsToShow - 1), j = 0; i >= 0; i--, j++) {
            let xPoint = Outlines[j][0]
            let yPoint = Outlines[j][1]
            if (i > 0) {
                let nextXPoint = Outlines[j + 1][0]
                let nextYPoint = Outlines[j + 1][1]
                let point1 = new Point(xPoint, yPoint)
                let point2 = new Point(nextXPoint, nextYPoint)
                drawLine(activityIcon, point1, point2, 2, getColor('fillColor'))
            }
        }

        // Draw inner lines of shoe
        for (let i = (Inlines.length - 1), j = 0; i >= 0; i--, j++) {
            let xPoint = Inlines[j][0]
            let yPoint = Inlines[j][1]
            let nextXPoint = Inlines[j][2]
            let nextYPoint = Inlines[j][3]
            let point1 = new Point(xPoint, yPoint)
            let point2 = new Point(nextXPoint, nextYPoint)
            drawLine(activityIcon, point1, point2, 2, getColor('fillColor'))
        }
    }
}

function createDateData(workout) {
    let dateString = new Date(workout.start_date);
    return dateString.toLocaleDateString('de-DE', {day: 'numeric', month: 'numeric', year: 'numeric',})
}

function createTimeData(workout) {
    let dateString = workout.start_date_local
    return dateString.slice(11, 16)
}

function createVelData(workout) {
    if (workout.type === workoutTypeBike) {
        return (`${(workout.average_speed * 3.6).toFixed(0)} km/h`);
    } else if (workout.type === workoutTypeRun) {
        let sec = (1000 / workout.average_speed)
        let min = Number(String(sec / 60).charAt(0))
        sec = (sec - min * 60).toFixed(0);
        if (sec < 10) {
            sec = `0${sec}`;
        }
        return (`${min.toFixed(0)}:${sec} /km`);
    } else {
        return "error";
    }
}

function createDistData(workout) {
    let dist = (workout.distance / 1000).toFixed(1)
    return (`${(dist).replace(".", ",")} km`);
}

function createDurData(workout) {
    let move_time = workout.moving_time
    let hour = Math.floor(move_time / 3600)
    let min = Math.floor(move_time / 60 - hour * 60)
    if (min < 10) {
        min = `0${min}`
    }
    let sec = (move_time - hour * 3600 - min * 60)
    if (sec < 10) {
        sec = `0${min}`
    }
    if (hour > 0) {
        return (`${hour}:${min}:${sec}`);
    } else {
        return (`${min}:${sec}`);
    }
}

function createKudosData(workout) {
    return (` ${workout.kudos_count} Kudos`)
}

function createElevGainData(workout) {
    return (`↑${(workout.total_elevation_gain).toFixed(0)} m`)
}

function createCaloriesData(workout) {
    let calories = (workout.kilojoules / 4.184).toFixed(0)
    return (`${calories} k/cal`)
}

function setSpacers(workout) {
    let screen_factor = 375 / Device.screenSize()["width"] //Screen size of the clients device related to the debugging device
    if (workout.type === workoutTypeBike) {
        timeSpacer = 30.5 * screen_factor
        velSpacer = 8.5 * screen_factor
        kudosSpacer = 5 * screen_factor
    } else if (workout.type === workoutTypeRun) {
        timeSpacer = 21 * screen_factor
        velSpacer = 5 * screen_factor
        kudosSpacer = 6 * screen_factor
    } else {
        return ("error")
    }
}

function getColor(colorName) {
    if (Device.isUsingDarkAppearance()) {
        mode = "dark"
    } else {
        mode = "light"
    }
    return new Color(colorPalette[mode][colorName])
}

async function getNewestActivity(access_token) {
    const activities_link = `https://www.strava.com/api/v3/athlete/activities?per_page=1&access_token=${access_token}`
    let req;
    req = new Request(activities_link)

    try {
        let res = await req.loadJSON()
        return res[0];
    } catch (error) {
        console.log("Something went wrong")
        throw new Error(`Login failed with HTTP-Status-Code ${req}`)
    }
}

async function getRefrehToken(init_code) {
    const refreshToken_link = auth_link
    let req;
    req = new Request(refreshToken_link)
    req.method = "POST";
    req.headers = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    }

    req.body = JSON.stringify({
        client_id: clientID,
        client_secret: clientSecret,
        code: init_code,
        grant_type: 'authorization_code'
    })
    try {
        let res = await req.loadJSON()
        return res.refresh_token;
    } catch (error) {
        console.log("Something went wrong")
        throw new Error(`Login failed with HTTP-Status-Code ${req}`)
    }
}

async function getAuthToken(ref_token) {
    let req;
    req = new Request(auth_link)
    req.method = "POST";
    req.headers = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    }

    req.body = JSON.stringify({
        client_id: clientID,
        client_secret: clientSecret,
        refresh_token: ref_token,
        grant_type: 'refresh_token'
    })
    try {
        let res = await req.loadJSON()
        return res.access_token;
    } catch (error) {
        console.log("Something went wrong")
        throw new Error(`Login failed with HTTP-Status-Code ${req}`)
    }
}

class Map {
    static drawGraph(strava_map){
        let input_array = this.decodePolyline(strava_map,5)
        let dataPointsToShow = input_array.length
        let lat_array = []
        let lon_array = []
        let spaceLeft = 25
        let spaceTop = 55
        let scaleFactor

        for (let i = 0; i < dataPointsToShow - 1; i++) {
            lat_array.push(input_array[i][1])
        }
        for (let i = 0; i < dataPointsToShow - 1; i++) {
            lon_array.push(input_array[i][0])
        }

        let latMin = Math.min(...lat_array)
        let lonMin = Math.min(...lon_array)
        let latMax = Math.max(...lat_array)
        let lonMax = Math.max(...lon_array)
        let difLat = latMax - latMin;
        let difLon = lonMax - lonMin;

        let difToLeft = latMin
        let difToTop = lonMin

        if (difLat > difLon) {
            scaleFactor = (150 / difLat).toFixed(2);
            spaceTop = spaceTop + (150 - difLon * scaleFactor) / 2;
        }
        if (difLon > difLat) {
            scaleFactor = (125 / difLon).toFixed(2);
            spaceLeft = (200 - difLat * scaleFactor) / 2;
        }

        for (let i = (dataPointsToShow - 1), j = 0; i >= 0; i--, j++) {
            let lat = ((lat_array[j] - difToLeft) * scaleFactor) + spaceLeft
            let lon = ((lon_array[j] - difToTop) * scaleFactor) + spaceTop
            if (i > 0) {
                let nextlat = ((lat_array[j + 1] - difToLeft) * scaleFactor) + spaceLeft
                let nextlon = ((lon_array[j + 1] - difToTop) * scaleFactor) + spaceTop
                let point1 = new Point(lat, lon)
                let point2 = new Point(nextlat, nextlon)
                drawLine(drawContext, point1, point2, lineWeight, getColor('mapColor'))
            }
        }
    }

    static decodePolyline(str, precision) {
        var index = 0,
            lat = 0,
            lng = 0,
            coordinates = [],
            shift = 0,
            result = 0,
            byte = null,
            latitude_change,
            longitude_change,
            factor = Math.pow(10, Number.isInteger(precision) ? precision : 5);

        while (index < str.length) {
            byte = null;
            shift = 0;
            result = 0;

            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

            shift = result = 0;

            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

            lat += latitude_change;
            lng += longitude_change;

            coordinates.push([lat / factor, lng / factor]);
        }

        return coordinates;
    }
}

function drawLine(relContext, point1, point2, width, color) {
    const path = new Path()
    path.move(point1)
    path.addLine(point2)
    relContext.addPath(path)
    relContext.setStrokeColor(color)
    relContext.setLineWidth(width)
    relContext.strokePath()
}

async function setupAssistant() {
    const promptInformation = new Alert()
    promptInformation.title = 'Einrichtungsassistent'
    promptInformation.message = 'Um das Activity Widget nutzen zu können, musst du die App für das Auslesen deines Strava Accounts autorisieren. Bist du damit einverstanden?'
    promptInformation.addAction('Ja')
    promptInformation.addCancelAction('Nein')

    if (await promptInformation.presentAlert() === 0) {
        const promptAuthorization = new Alert()
        promptAuthorization.title = 'Einrichtungsassistent'
        promptAuthorization.message = 'Um die App zu autorisieren klicke auf "Autorisieren", melde dich mit deinem Strava Account an und bestätige die Autorisierung. \n Anschließend wirst du auf eine 404 Page weitergeleitet. \n Kopiere hier gesamten Link aus der Adresszeile des Browsers.'
        promptAuthorization.addAction('Autorisieren')

        await promptAuthorization.present()
        Safari.open(`https://www.strava.com/oauth/authorize?client_id=${clientID}&redirect_uri=http://localhost&response_type=code&scope=read_all,activity:read_all`);
        const promptInputCode = new Alert()
        promptInputCode.title = 'Einrichtungsassistent'
        promptInputCode.message = 'Bitte füge den kopierten Code in das Eingabefeld ein und bestätige mit OK'
        promptInputCode.addTextField("Hier den Code eintragen...");
        promptInputCode.addAction('OK')

        await promptInputCode.present()
        var init_code = promptInputCode.textFieldValue(0).trim()
        init_code = init_code.split("&code=")
        init_code = init_code[1].split("&scope")
        init_code = init_code[0]
        console.log(init_code)

        while (init_code.length !== 40) {
            const promptCodeError = new Alert()
            promptCodeError.title = 'Fehler'
            promptCodeError.message = `Der Code sollte aus 40 Zeichen bestehen, der von dir eingegebene besteht nur aus ${init_code.lenght} Zeichen. Bitte kopiere den Code erneut und trage ihn in das nachfolgende Feld ein. Alternativ starte den Einrichtungsassistenten neu.`
            init_code = promptCodeError.addTextField("Hier den Code eintragen...");
            promptCodeError.addAction('OK')
            promptCodeError.addCancelAction('Abbruch')
            await promptCopyToken.present()
            init_code = init_code.split("&code=")
            init_code = init_code[1].split("&scope")
            init_code = init_code[0]
        }
        let ref_token = await getRefrehToken(init_code)
        Pasteboard.copy(ref_token)
        const promptCopyToken = new Alert()
        promptCopyToken.title = 'Einrichtungsassistent'
        promptCopyToken.message = 'Die Autorisierung war erfolgreich! Dir wurde nun ein Refresh-Token in die Zwischenablage kopiert, bitte füge diesen in die Widget-Parameter ein (Langer druck auf Widget -> Edit Widget -> "Parameter").'
        promptCopyToken.addAction('Fertigstellen')
        await promptCopyToken.present()
    }
}

/////////////////////////////////////////////////////////////
/////////////////////// Initial Config //////////////////////
/////////////////////////////////////////////////////////////

if (!config.runsInWidget && config.runsInApp) {
    const prompt = new Alert()
    prompt.message = 'Möchtest du den Setup Assistant starten?'
    prompt.addAction('Ja')
    prompt.addCancelAction('Nein')

    if (await prompt.presentAlert() === 0) {
        await setupAssistant()
    }
    return Script.complete()
}

if (widgetInput.length !== 40) {
    let widget = new ListWidget();
    let initInfo = widget.addText("Bitte starte den Einrichtungs-assistenten, indem du das Skript in der Scriptable App ausführst.")
    initInfo.font = Font.mediumSystemFont(14)
    initInfo.textColor = getColor('fillColor');
    Script.setWidget(widget)
    Script.complete()
}

// Preparation of data for widget
let acc_token = await getAuthToken(widgetInput.toString());
let newest_activity = await getNewestActivity(acc_token)

if (newest_activity.type !== workoutTypeBike && newest_activity.type !== workoutTypeRun) {
    let widget = new ListWidget();
    let initInfo = widget.addText("Der Typ Deines letzten Workouts wird leider nicht unterstützt.")
    initInfo.font = Font.mediumSystemFont(14)
    initInfo.textColor = getColor('fillColor');
    Script.setWidget(widget)
    Script.complete()
}

/////////////////////////////////////////////////////////////
/////////////////////// Widget Layout ///////////////////////
/////////////////////////////////////////////////////////////

// Prepare background map
Map.drawGraph(newest_activity.map.summary_polyline);

// Create widget
let widget = new ListWidget();
widget.setPadding(13, 13, 13, 13)

// Background (Color & Map)
widget.backgroundColor = getColor('backColor')
widget.backgroundImage = (drawContext.getImage())

// Header incl. activity icon and name of the newest activity
drawActivityIcon(newest_activity);
let firstLineStack = widget.addStack()
firstLineStack.addImage(activityIcon.getImage());
firstLineStack.addSpacer(3);

let firstLineSubstack = firstLineStack.addStack();
firstLineSubstack.layoutVertically();
firstLineSubstack.size = new Size(90, 30);

let timeDate = firstLineSubstack.addText(createDateData(newest_activity) + "   " + createTimeData(newest_activity))
timeDate.font = Font.boldSystemFont(10);
timeDate.textColor = getColor('textColor2');
timeDate.leftAlignText();

let title = firstLineSubstack.addText(newest_activity.name)
title.font = Font.mediumSystemFont(14)
title.textColor = getColor('textColor')
title.leftAlignText();
title.lineLimit = 1;

widget.addSpacer(14);

// Body with activity data: Left and right data stacks
// Stack initialization
let dataStack = widget.addStack()
dataStack.layoutHorizontally();
let dataStackLeft = dataStack.addStack()
dataStackLeft.layoutVertically();
dataStack.addSpacer(5);
let dataStackRight = dataStack.addStack()
dataStackRight.layoutVertically();

// LEFT: Calories
let caloriesText = dataStackLeft.addText(createCaloriesData(newest_activity))
caloriesText.font = Font.boldSystemFont(13);
caloriesText.textColor = getColor('textColor');
caloriesText.leftAlignText();

dataStackLeft.addSpacer(15);

// LEFT: Distance
let distanceText = dataStackLeft.addText(createDistData(newest_activity))
distanceText.font = Font.boldSystemFont(13);
distanceText.textColor = getColor('textColor');
distanceText.leftAlignText();

dataStackLeft.addSpacer(15);

// LEFT: Elevation Gain
let elevationGainText = dataStackLeft.addText(createElevGainData(newest_activity))
elevationGainText.font = Font.boldSystemFont(13);
elevationGainText.textColor = getColor('textColor');
elevationGainText.leftAlignText();

// Set spacers for right substacks (required because there is no option for right aligning text)
setSpacers(newest_activity)

// RIGHT: Duration
let firstDataSubstackRight = dataStackRight.addStack()
firstDataSubstackRight.layoutHorizontally()
firstDataSubstackRight.addSpacer(timeSpacer)
let duraText = firstDataSubstackRight.addText(createDurData(newest_activity))
duraText.font = Font.mediumSystemFont(13)
duraText.textColor = getColor('textColor1');

dataStackRight.addSpacer(15);

// RIGHT: Velocity
let secondDataSubstackRight = dataStackRight.addStack()
secondDataSubstackRight.layoutHorizontally()
secondDataSubstackRight.addSpacer(velSpacer)
let velText = secondDataSubstackRight.addText(createVelData(newest_activity))
velText.font = Font.mediumSystemFont(13)
velText.textColor = getColor('textColor1');

dataStackRight.addSpacer(15);

// RIGHT: Kudos
let thirdDataSubstackRight = dataStackRight.addStack()
thirdDataSubstackRight.layoutHorizontally()
thirdDataSubstackRight.addSpacer(kudosSpacer)
let kudosText = thirdDataSubstackRight.addText(createKudosData(newest_activity))
kudosText.font = Font.mediumSystemFont(13)
kudosText.textColor = getColor('textColor1');

widget.addSpacer(5)

Script.setWidget(widget)
Script.complete()