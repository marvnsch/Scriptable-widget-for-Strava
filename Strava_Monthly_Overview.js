// DEBUG
let debug = true

// Read widget parameters
let ref_token;
let runGoal;
let rideGoal;
let swimGoal;
let detailedGoalStatus = false;

try {
    widgetInput = args.widgetParameter.split(";")
} catch (e) {
    errorMessage = "No widget parameter found!"
    if (!config.runsInApp) {
        throw new Error(errorMessage);
    }
}

if (config.runsInWidget && !config.runsInApp) {
    ref_token = widgetInput[0].toString()
    runGoal = widgetInput[1].toString();
    rideGoal = widgetInput[2].toString();
    swimGoal = widgetInput[3].toString();
    detailedGoalStatus = widgetInput[4].toString();
} else {
    ref_token = "..."
}

// Initialize file manager and storage file
let fileManager;
try {
    fileManager = FileManager.iCloud();
}
catch (e) {
    fileManager = FileManager.local();
}
const docDir = fileManager.documentsDirectory();
const activityStorage = fileManager.joinPath(docDir, "StravaActivityHistory.txt");

// Widget colors
const colorPalette = {
    dark: {
        backColor: '1D1C21',
        brightOrange: 'FC4C02',
        lightOrange: 'FC4CFF',
        textColor: 'EDEDED',
    },
    light: {
        backColor: 'FFFFFF',
        brightOrange: 'FC4C02',
        lightOrange: 'FC4CFF',
        textColor: '1D1C21',
    }
};

// iPhone screen res table
function deviceWidgetSizes() {
    let phones = {
        // iPhone 12 Pro Max
        "2778": {
            small: 510,
            medium: 1092,
            large: 1146,
            devices: "12 Pro Max"
        },

        // iPhone 12, 12 Pro
        "2532": {
            small: 474,
            medium: 1014,
            large: 1062,
            devices: "12, 12 Pro"
        },

        // iPhone 11 Pro Max, XS Max
        "2688": {
            small: 507,
            medium: 1080,
            large: 1137,
            devices: "12, 12 Pro"
        },

        // iPhone 11, XR
        "1792": {
            small: 338,
            medium: 720,
            large: 758,
            devices: "11, XR"
        },

        // iPhone 11 Pro, XS, X, 12 mini
        "2436": {
            small: 465,
            medium: 987,
            devices: "11 Pro, XS, X, 12 mini"
        },

        // Plus phones
        "2208": {
            small: 471,
            medium: 1044,
            large: 1071,
            devices: "iPhone [...] Plus"
        },

        // iPhone SE2 and 6/6S/7/8
        "1334": {
            small: 296,
            medium: 642,
            large: 648,
            devices: "SE2, 6, 6S, 7, 8"
        }
    }
    return phones;
}

const operatingDeviceWidgetSizes = deviceWidgetSizes()[Device.screenResolution().height];

// Set widget dimensions
let widgetWidth;
let widgetHeight;
const widgetPresentation = config.widgetFamily;

switch (widgetPresentation) {
    case "medium":
        widgetWidth = (operatingDeviceWidgetSizes.medium / Device.screenScale());
        widgetHeight = (operatingDeviceWidgetSizes.small / Device.screenScale());
        break;
    case "large":
        widgetWidth = (operatingDeviceWidgetSizes.large / Device.screenScale());
        widgetHeight = widgetWidth;
        break;
    default:
        widgetWidth = (operatingDeviceWidgetSizes.small / Device.screenScale());
        widgetHeight = widgetWidth;
        break;
}

// Workout types
const Ride = "Ride";
const Run = "Run";
const Swim = "Swim";

// Authentication link
const auth_link = "https://www.strava.com/oauth/token";

// Calender widget class
class activityCalenderWidget{
    async init() {
        // Create widget
        let widget = new ListWidget();
        widget.backgroundColor = getColor('backColor')
        let outerPadding = 0.085 * widgetHeight;
        widget.setPadding(5, outerPadding, outerPadding, outerPadding);
        let calendarSize = new Size(widgetWidth - 2 * outerPadding, widgetHeight - outerPadding - 5);

        // Header
        let mainStack = widget.addStack();
        let headerPartition = 0.2
        let headerStackHeight = headerPartition * stackSize.width;
        let headerStack = mainStack.addStack();
        headerStack.size = new Size(calendarSize.width, headerStackHeight);
        await this.setHeader(headerStack, headerStackHeight);

        // Calender layout
        let calendarStack = mainStack.addStack();
        let calendarStackHeight = (1 - headerPartition) * stackSize;
        calendarStack.size = new Size(calendarSize.width, calendarStackHeight);
        calendarStack.layoutVertically();
        await this.prepareCalendar(calendarStack, calendarSize, calendarStackHeight);

        Script.setWidget(widget)
        Script.complete()
    }

    async setHeader(headerStack, headerHeight) {
        let dFormatter = new DateFormatter("MMMM");
        let headerText = headerStack.addText(dFormatter.string(new Date()));
        headerText.font = Font.mediumSystemFont(0.83 * headerHeight);
        if (widgetPresentation === "medium") {
            headerStack.centerAlignContent();
        }
        return headerStack;
    }

    async prepareCalendar(calendarStack, width, height) {
        let dayBoxPadding = 5;
        let dayBoxWidth = (width - 6 * dayBoxPadding) / 7;
        let dayBoxSize = new Size(dayBoxWidth, dayBoxWidth);
        let weekStacks = [];
        let dayStacks = {};
        let dateKey = await this.getFirstDayOfMonth();
        for (let i = 1; i <= await this.getWeeksOfMonth(); i++) {
            weekStacks[i] = calendarStack.addStack();
            if (i !== await this.getWeeksOfMonth()) {
                calendarStack.addSpacer(dayBoxPadding);
            }
            for (let j = 1; j <= 7; j++) {
                dayStacks[dateKey] = weekStacks[i].addStack();
                dayStacks[dateKey].size = dayBoxSize;
                dayStacks[dateKey].cornerRadius = 0.15 * dayBoxWidth;
                if (!((i === 1 && j < this.getFirstDayOfMonth().getDay()) || (i === await this.getWeeksOfMonth() && j > this.getLastDayOfMonth().getDay()))) {
                    dayStacks[dateKey].color = await getColor(await this.getColorForTheDay(dateKey));
                }
                dateKey.setDate(dateKey.getDate() + 1);
            }
        }
        return dayStacks;
    }

    async getColorForTheDay(date) {
        // Screen activities for the date
        // If there was an activity:
        //    Calculate average distance or intensity for the whole month and evaluate if the specific activity was longer / more intense than average
        //        If true -> return "brightOrange"
        //        If false -> return "lightOrange"
        // If there was no activity on that day -> "return grey"
        return "brightOrange"
    }

    async getFirstDayOfMonth() {
        let currentYear = new Date().getFullYear();
        let currentMonth = new Date().getMonth();
        return new Date(currentYear, currentMonth - 1, 1);
    }

    async getLastDayOfMonth() {
        let currentYear = new Date().getFullYear();
        let currentMonth = new Date().getMonth();
        return new Date(currentYear, currentMonth, 0);
    }

    async getWeeksOfMonth() {
        let days = this.getFirstDayOfMonth().getDay() + 6 + this.getLastDayOfMonth().getDate();
        return Math.ceil(days / 7) - 1;
    }
}

////////////////////////////////////////////////////////////////////////////////
//////////////////////////        Widget-Functions        //////////////////////
////////////////////////////////////////////////////////////////////////////////

function getColor(colorName) {
    let lightColor = new Color(colorPalette['light'][colorName])
    let darkColor = new Color(colorPalette['dark'][colorName])
    return Color.dynamic(lightColor, darkColor)
}

async function updateActivityStorage(access_token) {
    const activities_link = `https://www.strava.com/api/v3/athlete/activities?per_page=100&access_token=${access_token}`
    let req;
    let onlineActivities;
    let localActivities = [];
    let localActivityIDs = [];
    req = new Request(activities_link)

    try {
        onlineActivities = await req.loadJSON()
    } catch (error) {
        console.log("Something went wrong")
        throw new Error(`Login failed with HTTP-Status-Code ${req}`)
    }

    try {
        if (fileManager.fileExists(activityStorage)) {
            localActivities = JSON.parse(fileManager.readString(activityStorage));
            for (let localActivity of localActivities) {
                localActivityIDs.push(localActivity.id)
            }
            for (let i = 0; i < onlineActivities.length; i++) {
                if (onlineActivities[i].id in localActivityIDs) {
                    break
                }
                localActivities.push(onlineActivities[i]);
            }
        } else {
            for (let i = 0; i < onlineActivities.length; i++) {
                localActivities.push(onlineActivities[i]);
            }
        }
        fileManager.writeString(activityStorage, JSON.stringify(localActivities));
    } catch (e) {
        throw new Error(e)
    }
}

async function getRefreshToken(init_code) {
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
        let ref_token = await getRefreshToken(init_code)

        const promptDeviceSelection = new Alert()
        promptDeviceSelection.title = 'Gerätauswahl'
        promptDeviceSelection.message = 'Bitte wähle Dein Gerät. \n Sollte Dein Gerät nicht auftauchen, wird es aktuell noch nicht unterstützt.'
        promptDeviceSelection.addAction('iPhone 11')
        promptDeviceSelection.addAction('iPhone 11 Pro')
        promptDeviceSelection.addCancelAction('Abbruch')
        let deviceModel = deviceWidgetSize[await promptDeviceSelection.presentAlert()]

        const promptLayoutSelection = new Alert()
        promptLayoutSelection.title = 'Layoutauswahl'
        promptLayoutSelection.message = 'Bitte wähle das gewünschte Layout.\nVerfügbare Layouts findest du hier: Link auf github Seite.'
        promptLayoutSelection.addAction('clean')
        promptLayoutSelection.addAction('detailed')
        promptLayoutSelection.addCancelAction('Abbruch')
        let layoutPreference = await promptLayoutSelection.presentAlert()

        const widgetConfig = ref_token + ";" + layoutPreference + ";" + deviceModel
        Pasteboard.copy(widgetConfig)
        const promptCopyConfiguration = new Alert()
        promptCopyConfiguration.title = 'Einrichtungsassistent'
        promptCopyConfiguration.message = 'Die Autorisierung war erfolgreich! Dir wurde die Widget-Konfiguration in die Zwischenablage kopiert, bitte füge diese in die Widget-Parameter ein (Langer druck auf Widget -> Edit Widget -> "Parameter").'
        promptCopyConfiguration.addAction('Fertigstellen')
        await promptCopyConfiguration.present()
    }
}

/////////////////////////////////////////////////////////////
/////////////////////// Initial Config //////////////////////
/////////////////////////////////////////////////////////////

if (!config.runsInWidget && config.runsInApp && !debug) {
    const prompt = new Alert()
    prompt.message = 'Möchtest du den Setup Assistant starten?'
    prompt.addAction('Ja')
    prompt.addCancelAction('Nein')

    if (await prompt.presentAlert() === 0) {
        await setupAssistant()
    }
    if (debug === false){
        Script.complete()
    }
}
if (debug === false){
    if (widgetInput.length < 40) {
        let widget = new ListWidget();
        let initInfo = widget.addText("Bitte starte den Einrichtungs-assistenten, indem du das Skript in der Scriptable App ausführst.")
        initInfo.font = Font.mediumSystemFont(14)
        initInfo.textColor = getColor('textColor');
        Script.setWidget(widget)
        Script.complete()
    }
}

// Update activity database
try {
    const acc_token = await getAuthToken(ref_token);
    await updateActivityStorage(acc_token);
} catch(e) {
    if (!fileManager.fileExists(activityStorage)) {
        throw new Error("Es existieren keine Aktivitäten! (file missing)")
    }
}

/////////////////////////////////////////////////////////////
///////////// Widget Layout - Newest Activity ///////////////
/////////////////////////////////////////////////////////////

await new activityCalenderWidget().init();