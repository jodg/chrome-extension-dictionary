function Word() {

}

Word.onCatch = function () {
    $("body").on(
        "mouseup.dialog_dictionary_handler", function (e) {
            chrome.runtime.sendMessage({
                action: 'disabled'
            }, function (responseText) {
                if (!responseText.disabled) {
                    return false;
                }

                if ($("#dialog_dictionary_modal_body").is(":visible") == true) {
                    return false;
                }
                var w = "";
                if (window.getSelection()) {
                    w = window.getSelection().toString().toLowerCase();
                }
                if (w != "") {
                    chrome.runtime.sendMessage({
                        action: 'xhttp',
                        data: w
                    }, function (responseText) {
                        var info = JSON.parse(responseText);
                        var xOffset = 15;
                        var yOffset = 15;

                        $("body").append("<div id='dialog_dictionary_modal_dialog'><div class='modal-header'><span class='btn-close'>×</span></div><div id='dialog_dictionary_modal_body'></div>");
                        $("#dialog_dictionary_modal_dialog")
                            .css("top", (e.pageY + yOffset) + "px")
                            .css("left", (e.pageX + xOffset) + "px")
                            .show()
                            .fadeIn("slow");
                        var html_str = "";
                        if (info.word_name) {
                            if (info.symbols[0].word_symbol) {
                                html_str += "<p>" + "<span style='font-size: 18px;'>" + info.word_name + "</span>" + "</p>";
                                html_str += "<p>" + "<span " + (info.symbols[0].symbol_mp3 == "" ? "" : "class='dialog_dictionary_modal_audio'") + " audio_src='" + info.symbols[0].symbol_mp3 + "'>拼音: [ " + info.symbols[0].word_symbol + " ]</span>";

                                var parts = info.symbols[0].parts;
                                $.each(parts, function (idx, obj) {
                                    html_str += "<p>" + obj.part_name + "</p>";
                                    $.each(obj.means, function (idx, obj) {
                                        html_str += "<p class='dialog_dictionary_modal_means'>" + obj.word_mean + "</p>";
                                    });
                                });
                            } else {
                                html_str += "<p>" + "<span style='font-size: 18px;'>" + info.word_name + "</span>" + "</p>";
                                html_str += "<p>" + "<span " + (info.symbols[0].ph_en_mp3 == "" ? "" : "class='dialog_dictionary_modal_audio'") + " audio_src='" + info.symbols[0].ph_en_mp3 + "'>英: [ " + info.symbols[0].ph_en + " ]</span>" +
                                "  <span " + (info.symbols[0].ph_am_mp3 == "" ? "" : "class='dialog_dictionary_modal_audio'") + " audio_src='" + info.symbols[0].ph_am_mp3 + "'>美: [ " + info.symbols[0].ph_am + " ]</span>" + "</p>";


                                var parts = info.symbols[0].parts;
                                $.each(parts, function (idx, obj) {
                                    html_str += "<p>" + obj.part + "</p><p class='dialog_dictionary_modal_means'>" + obj.means.join(";</p><p class='dialog_dictionary_modal_means'>") + "</p>";
                                });
                            }
                        } else {
                            html_str = "<span>" + w + "  木有找到...</span>";
                        }
                        $("#dialog_dictionary_modal_body").html(html_str);
                        $(".dialog_dictionary_modal_audio").off();
                        $(".dialog_dictionary_modal_audio").click(function () {
                            chrome.runtime.sendMessage({
                                action: 'audio',
                                data: $(this).attr('audio_src')
                            }, function (responseText) {

                            });
                        });
                        $(".btn-close").click(function () {
                            $("#dialog_dictionary_modal_dialog").remove().fadeOut("slow");
                        });
                    });
                }
            });
        }
    );
};

//
//Word.offCatch = function () {
//    $("body").off("mouseup.dialog_dictionary_handler");
//};

chrome.extension.onRequest.addListener(Word.onCatch());