import { Convert, TasbehnaLyrics } from "./tasbehnalyrics";
import data from "./tasbe7naDB.json";
import xmlbuilder, { XMLElement } from "xmlbuilder";
import * as fs from "fs";
//convert data into TasbehnaLyrics interface

let formattedData = data as TasbehnaLyrics[];

//iterate on the songs and create open lyrics xml

formattedData.forEach((song) => {
  // Create an XML root element with OpenLyrics namespace
  const root = createXML(song);

  // Convert the XML object to string and print it
  console.log(root.end({ pretty: true }));

  // Save the XML object to a file
  SaveXML(root, song.title + ".xml");
});

function SaveXML(root: XMLElement, fileName: string) {
  const xml = root.toString();

  // Write the XML string to a file named output.xml
  fs.writeFile("songs/" + fileName, xml, (err: any) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
}

function createXML(song: TasbehnaLyrics) {
  const root = xmlbuilder
    .create("song", { encoding: "utf-8" })
    .att("xmlns", "http://openlyrics.info/namespace/2009/song")
    .att("version", "0.9");

  // Add properties element with title and author subelements
  const properties = root.ele("properties");
  properties.ele("titles").ele("title", song.title);
  // properties.ele('authors').ele('author', song.author);

  // Add lyrics element with verse subelements
  const lyrics = root.ele("lyrics");
  let verseIndex = 1;
  for (let verse of song.verses) {
    // Add verse element with name attribute
    const verseElement = lyrics.ele("verse", { name: "v" + verseIndex++ });
    // Add lines element with line subelements
    for (let line of verse) {
      verseElement.ele("lines", line);
    }
  }
  if (song.chorus) {
    const chorusElement = lyrics.ele("verse", { name: "c" });
    // const linesElement = chorusElement.ele("lines");
    for (let line of song.chorus) {
      chorusElement.ele("lines", line);
    }
  }

  //add order of verses element
  let orderString = "";
    for (let i = 1; i < song.verses.length; i++) {
        orderString += "v" + i + " ";
    }
    if (song.chorus) {
        if(!song.chorusFirst){
            orderString += "c ";
        }
        else {
            orderString = "c " + orderString;
        }
    }
    properties.ele("verseOrder", orderString);

  return root;
}
