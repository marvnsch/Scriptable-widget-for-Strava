// Updater config
const url = 'https://raw.githubusercontent.com/marvnsch/Scriptable-Strava-Widget/main/Strava_activity_widget.js';
const scriptName = 'Strava-Activity-Widget-Remote'

// API config
const clientID = ''; // <-- Client ID from Strava API goes here
const clientSecret = ''; // <-- Client secret from Strava API goes here

class WidgetUpdater {
  constructor() {
    this.fileManager = FileManager.iCloud()
    this.documentsDirectory = this.fileManager.documentsDirectory()
  }
  async updateScript(name, sourceUrl, icon, color) {
    let filePath = this.fileManager.joinPath(this.documentsDirectory, name + '.js');
    let req = new Request(sourceUrl);
    let code = await req.loadString();
    let codeToStore = Data.fromString(`// Variables used by Scriptable.\n// These must be at the very top of the file. Do not edit.\n// icon-color: ${color}; icon-glyph: ${icon};\n\nclientID = '${clientID}'\nclientSecret = '${clientSecret}' \n\n${code}`);
    this.fileManager.write(filePath, codeToStore);
    let selfFilePath = this.fileManager.joinPath(this.documentsDirectory, Script.name() + '.js');
  }
}

await new WidgetUpdater().updateScript(scriptName, url, 'bicycle', 'orange');
