/* Copyright (c) 2011 Arnaud Renevier, Inc, published under the modified BSD
 * license. */

var ISIE = !!window.attachEvent && (Object.prototype.toString.call(window.opera) != '[object Opera]')

function showFileContent(button, zip) {
    var infos = button.data('infos');
    var content;
    try {
        content = zip.extract(infos.filename);
    } catch (e) {
        var message = infos.filename + " could not be read: " + e.message;
        $("#message").text(message).addClass('error').show("slow");
        button.remove();
    }

    var presentation = null;
    if (!ISIE) {
        var idx = infos.filename.lastIndexOf('.');
        var ext = "";
        if (idx !== -1) {
            ext = infos.filename.slice(idx + 1).toLowerCase();
        }

        if (ext === "png" || ext === "gif" || ext === "jpg" || ext === "jpeg") {
            presentation = $('<img>');
            presentation.attr('src', 'data:image/' + ext + ';base64,' + btoa(content));
        }
    }

    if (ISIE) {
        content = content.replace(/(?!\r)\n/gm, '\r');
    }

    if (!presentation) {
        presentation = $('<pre></pre>').text(content);
    }
    presentation.addClass('filecontent');
    button.before(presentation).remove();
}

 function showZip(filename, buffer) {
    var zip, container = $('#main');

    try {
        zip = new ZipFile(buffer);
    } catch (e) {
        $("#message").text("zip file could not be read: " + e.message).addClass('error').show();
        return;
    }

   $("#fname").text(filename);
    if (zip.comment) {
        var comment = zip.comment;
        if (ISIE) {
            comment = comment.replace(/(?!\r)\n/gm, '\r');
        }

        if (comment.indexOf("\n") === -1 && comment.indexOf("\r") === -1) { // one liner
            alert('ok');
            $("#gcommentcontent").css('display', 'inline');
        }
        $("#gcommentcontent").text(comment);
        $("#comment").show();
    } else {
        $("#comment").hide();
    }

    for (var idx = 0; idx < zip.filelist.length; idx++) {
        var file = zip.filelist[idx];
        var name = $("<div></div>").text(file.filename);
        var infosEl = $('<div class="fileinfos"></div>');

        var dateInfo = $("<div></div>").append('<span class="prop">file date:</span>&nbsp;');
        dateInfo.append(document.createTextNode(file.date_time.toLocaleString()));

        var sizeInfo = $("<div></div>").append('<span class="prop">file size:</span>&nbsp;');
        sizeInfo.append(document.createTextNode(file.file_size));

        var commentInfo = null;
        if (file.comment) {
            commentInfo = $("<div></div>").append('<span class="prop">file comment:</span>&nbsp;');
            commentInfo.append(document.createTextNode(file.file_size));
        }

        var showControl = $('<input type="button" value="show file content">').click(function() {
            showFileContent($(this), zip);
        }).data('infos', file);

        infosEl.append(dateInfo).append(sizeInfo).append(commentInfo).append(showControl);

        var item = $('<li class="item"></li>').append(name).append(infosEl).css('list-style-type', 'none');
        container.append(item);
    }
    $(".item").collapser({selector: ".fileinfos", openIcon: "external/arrow-left-mini.png", closeIcon: "external/arrow-down-mini.png"});
}

$(function () {
    var filename = "zipfile.zip";
    var req = new XMLHttpRequest();  
    req.open('GET', filename, false);  
    // see http://mgran.blogspot.com/2006/08/downloading-binary-streams-with.html
    if (req.overrideMimeType) {
        req.overrideMimeType('text/plain; charset=x-user-defined');  
    } else {
        req.setRequestHeader('Accept-Charset', 'x-user-defined');
    }
    req.send(null);

    var buffer = "";
    var dbata;
    try {
        bdata = BinaryToArray(req.responseBody).toArray();
        for (var i = 0, len = bdata.length - 1; i < len; i++) { // dbata is one byte too long. Why ???
            buffer += String.fromCharCode(bdata[i] & 0xFF);
        }
    } catch(e) {
        bdata = req.responseText;
        for (var i = 0, len = bdata.length; i < len; i++) {
            buffer += String.fromCharCode(bdata.charCodeAt(i) & 0xFF);
        }
    }
    showZip(filename, buffer);
});
