const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const {
    ms,
    s,
    m,
    h,
    d
} = require('time-convert')
const fetch = require('isomorphic-unfetch')
const { getData, getPreview, getTracks, getDetails } = require('spotify-url-info')(fetch)
const Discord = require("discord.js");
const MessageEmbed = Discord.MessageEmbed
const MessageActionRow = Discord.MessageActionRow
const MessageButton = Discord.MessageButton
const SOTDHistory = require("../models/SOTDHistory")
const utils = require('../etc/utils')
var convert = require('color-convert');

function msToHms(time, ms) {
    let pretty = ms.to(h, m, s)(time)
    pretty[0] = utils.zeropad(pretty[0])
    pretty[1] = utils.zeropad(pretty[1])
    pretty[2] = utils.zeropad(pretty[2])
    let out = "00:00:00"
    if (pretty[0] == "00") {
        pretty.splice(0, 1)
        //console.log(pretty)
        out = `${pretty[0]
            }:${pretty[1]
            }`
    } else {
        out = `${pretty[0]
            }:${pretty[1]
            }:${pretty[2]
            }`
    }
    //console.log(out)

    return out
}
async function buildSotdEmbed(ping_role, user_credit, spotify_url_to_parse) {

    await getData(spotify_url_to_parse).then(data => spotifydata = data)
    const trackinfo = spotifydata
    //console.log(trackinfo)
    const coverArtData = trackinfo.coverArt
    //console.log(coverArtData)

    const album_image = coverArtData.sources[1].url
    //console.log(album_image)
    //console.log(coverArtData.extractedColors.colorDark.hex)

    const dominant_color = convert.hex.rgb(coverArtData.extractedColors.colorDark.hex)
    //console.log(dominant_color)

    var explicit = trackinfo.isExplicit
    if (explicit) {
        explicit = "Yes"
    } else {
        explicit = "No"
    }

    const duration = trackinfo.duration
    var pretty_duration = msToHms(duration, ms)
    //console.log(pretty_duration)
    var ReleaseDate = trackinfo.releaseDate.isoString
    dformatted = new Date(ReleaseDate)


    const sotdPingEmbed = new EmbedBuilder().setColor(dominant_color).setTitle("Announcement ping.").setDescription(`Hey ${ping_role}! There's a new SOTD suggestion!`).setImage(album_image).addFields({
        name: `Song`,
        value: `${trackinfo.name
            }`
    }, {
        name: `Artist`,
        value: `${trackinfo.artists[0].name
            }`
    }, {
        name: `Duration`,
        value: `${pretty_duration}`
    }, {
        name: `Released`,
        value: `${dformatted}`
    }, {
        name: `Spotify URL`,
        value: `${spotify_url_to_parse}`
    }, {
        name: `Explicit`,
        value: `${explicit}`
    }, {
        name: `Suggested By:`,
        value: `${user_credit}`
    }).setFooter({ text: 'Thanks for the song suggestion!' }).setTimestamp()

    return sotdPingEmbed
}

async function hasAnnouncedHistory(serverID, songID) {
    let history_count = await SOTDHistory.count({ guild_id: serverID.toString(), song_ID: songID.toString() })
    if (history_count > 0) {
        return true
    } else {
        return false
    }
}
module.exports = {
    data: new SlashCommandBuilder().setName('announce').setDescription('Create a SOTD announcement').addStringOption(option => option.setName('spotify-url').setDescription('Spotify URL').setRequired(true)).addRoleOption(option => option.setName('ping-role').setDescription('The role to ping for the announcement').setRequired(true)).addUserOption(option => option.setName('user-credit').setDescription('The user to credit for the song suggestion').setRequired(true)).addBooleanOption(option => option.setName("force").setDescription("Force the song to be announced even if it's been announced before")),


    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })
        const spotify_url_to_parse = interaction.options.getString('spotify-url')
        let isNewURl = spotify_url_to_parse.includes("?si=")
        const songID = utils.getSongID(spotify_url_to_parse, isNewURl)
        console.log(songID)
        const guild_ID = interaction.guild.id
        let sotdPingEmbed = await buildSotdEmbed(interaction.options.getRole('ping-role'), interaction.options.getUser('user-credit'), spotify_url_to_parse)
        let announced = await hasAnnouncedHistory(guild_ID, songID)
        let forced = interaction.options.getBoolean("force")
        console.log(forced)
        if (announced & !forced){
            let historyitem = await SOTDHistory.findOne({ guild_id: guild_ID.toString(), song_ID: songID.toString() })
            let date = historyitem.date_announced.toString()
            const NoticeEmbed = new EmbedBuilder()
            .setColor([255,0,0])
            .setTitle("Notice")
            .setDescription(`It appears you already have announced this song in this server before.\nIf you still would like to announce this song set the Force option to true`)
            .addFields({
                name: `Last announced`,
            value: `_${date}_`
        });
        await interaction.editReply({content: 'Announcement Cancelled!', ephemeral: true })
            await interaction.followUp({ ephemeral: true, embeds: [NoticeEmbed]})
        
        }else if (announced & forced){
            await interaction.editReply({ content: 'Forced Announcement Sent!', ephemeral: true })
            await interaction.channel.send({ embeds: [sotdPingEmbed] })
        }else {
            var SOTDHistoryEntry = new SOTDHistory({ guild_id: interaction.guild.id, song_ID: songID, date_announced: Date.now() })
            SOTDHistoryEntry.save();

            await interaction.editReply({ content: 'Announcement Sent!', ephemeral: true })
            await interaction.channel.send({ embeds: [sotdPingEmbed] })
        }
    }
};
