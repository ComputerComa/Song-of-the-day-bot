module.exports = {
    zeropad: function zeropad(number){
         if(number < 10){
           number = '0' + number
           return number.toString()
         }else{
           return number.toString()
         }
       },
     getSongID: function getSongID(spotifyurl,newURL){
       let BaseURI = 'spotify:track:'
         var split_url = spotifyurl.split("/")
         var len = split_url.length
         var trackid = split_url[len - 1]
         if(newURL){
           NewTrackid = trackid.split("?")
           trackid = NewTrackid[0]
         }
         let outrackID = BaseURI + trackid
         console.log(outrackID)
         return outrackID
       }
 }