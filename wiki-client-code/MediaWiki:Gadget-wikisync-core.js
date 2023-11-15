/**
 * WikiSync:
 * - Utilises our WikiSync API, with data provided by users via RuneLite.
 * - Adds the ability to check a user's completed quests.
 * 
 * Slightly adapted from https://runescape.wiki/w/MediaWiki:Gadget-questchecker-core.js
 *
 * @author Jayden
 * @author Andmcadams
 * @author Jakesterwars
 * @author Cook Me Plox
 * @author Lezed1
 * @author Haidro
 */

var CLASSES = {
  QC_ACTIVE: "qc-active",
  QC_INPUT: "qc-input",
  QC_ICON: "rs-qc-icon",
};

var ENDPOINTS = {
  osrs: "https://sync.runescape.wiki/runelite/player/username/STANDARD",
  trailblazerreloaded:
    "https://sync.runescape.wiki/runelite/player/username/TRAILBLAZER_RELOADED_LEAGUE", //use actual url
};

var questCorrections = {
    // Add corrections for API quest names -> wiki names here.
    // API quest name is the key and the wiki page name is the value.
    "Desert Treasure II - The Fallen Empire": "Desert Treasure II"
  },
  icons = {
    yes: ' <span class="' + CLASSES.QC_ICON + '"><img class="qc-complete" src="//oldschool.runescape.wiki/images/Yes_check.svg?00000" width="15px" ></span>',
    no: ' <span class="' + CLASSES.QC_ICON + '"><img class="qc-not-started" src="//oldschool.runescape.wiki/images/X_mark.svg?00000" width="13px" ></span>',
  };

var wikisync = {
  /**
   * Startup method
   */
  init: function () {
    wikisync.createFields();
    wikisync.intializeTasksPage();
  },

  setCheckboxText: function (text) {
    $(".rs-wikisync-hide-completed .oo-ui-labelElement-label").each(
      function () {
        $(this).text(text);
      }
    );
  },

  updateHiddenEntries: function () {
    var hideCompleted = wikisync.hideCompletedCheckbox.isSelected();
    var shown = 0;
    var shown_in_regions = 0;
    $(".wikisync-completed, [data-tbz-area-for-filtering]").each(function () {
      var should_hide_based_on_completed = hideCompleted && $(this).hasClass("wikisync-completed");
      var area_checkbox = wikisync.tbz_areas[$(this).data("tbz-area-for-filtering")];
      var should_hide_based_on_area = area_checkbox === undefined ? false : !area_checkbox.isSelected();
      if (!should_hide_based_on_area) {
        shown_in_regions++;
      }
      if (should_hide_based_on_completed || should_hide_based_on_area) {
        $(this).hide()
      } else {
        shown++;
        $(this).show();
      }
    });
    $("#tbz-wikisync-number-of-shown-tasks").text("Currently showning " + shown + " tasks");
    $("#tbz-wikisync-number-of-region-tasks").text(shown_in_regions);
  },

  /**
   * Creates the input fields for the user's RSN
   */
  createFields: function () {
    var name;
    if (rs.hasLocalStorage() === true) {
      $.removeCookie("RSN", { path: "/" }); // remove any existing cookies using jQuery, will return false if it doesn't exist so it's fine
      name = localStorage.getItem("rsn");
    } else {
      name = wikisync.getCookie("RSN");
    }

    var gamemode = localStorage.getItem('wikisync-gamemode') || "osrs";

    $("." + CLASSES.QC_INPUT).each(function () {
      var input1 = new OO.ui.TextInputWidget({
        placeholder: "Display name",
        id: "rs-qc-rsn",
      });

      if (name) {
        // Set input to cookie/localStorage value.
        input1.setValue(name);
      }

      var button1 = new OO.ui.ButtonInputWidget({
        label: new OO.ui.HtmlSnippet(
          '<img src="' +
            rs.getFileURLCached("RuneLite icon.png") +
            '" width=' +
            '"20px" />' +
            " Look up"
        ),
        title: "Look up player data using RuneLite",
        flags: ["primary", "progressive"],
        classes: ["wikisync-lookup-button"],
      });
      
      var buttonOptionOSRS = new OO.ui.ButtonOptionWidget({
        data: 'osrs',
        label: new OO.ui.HtmlSnippet('<img src="https://oldschool.runescape.wiki/images/Wikisync_icon_(standard).png" width="20px" />' + ' OSRS'),
        classes: ['wikisync-gamemode-osrs'],
        selected: gamemode !== 'trailblazerreloaded',
      }),
      buttonOptionShatner = new OO.ui.ButtonOptionWidget({
        data: 'trailblazerreloaded',
        label: new OO.ui.HtmlSnippet('<img src="https://oldschool.runescape.wiki/images/thumb/Leagues_icon.png/40px-Leagues_icon.png?0570b" width="20px" />' + ' League'),
        classes: ['wikisync-gamemode-trailblazerreloaded'],
        selected: gamemode === 'trailblazerreloaded',
      }),
      buttonSelect = new OO.ui.ButtonSelectWidget({
        items: [
          buttonOptionOSRS,
          buttonOptionShatner
        ]
      });      

      var leagueOnly = $(this).hasClass("league-only");
      if (leagueOnly) {
        gamemode = "trailblazerreloaded";
      }

      var button1action = function () {
      	if (!leagueOnly) {
			var gamemodeButton = buttonSelect.findSelectedItem();
			if (gamemodeButton !== null) {
				gamemode = gamemodeButton.getData();
			}
		}
        if (rs.hasLocalStorage() === true) {
          localStorage.setItem("rsn", input1.value); // save in localStorage
          localStorage.setItem('wikisync-gamemode', gamemode);
        } else {
          wikisync.setCookie("RSN", input1.value, 30); // set a cookie for 30 days
        }
        wikisync.loadData(input1.value, gamemode);
      };
      button1.on("click", button1action);
      input1.on("enter", button1action);

      var helpModalBtn = new OO.ui.ButtonWidget({
        label: "Learn how to enable WikiSync",
        href: "/w/RuneScape:WikiSync",
      });

      var hideCompleted = false;
      if (rs.hasLocalStorage()) {
        if (localStorage.getItem("wikisync-hide-completed") === "true") {
          hideCompleted = true;
        }
      }
      wikisync.hideCompletedCheckbox = new OO.ui.CheckboxInputWidget({
        selected: hideCompleted,
      });
      wikisync.hideCompletedCheckbox.on("change", function () {
        var selected = wikisync.hideCompletedCheckbox.isSelected();
        if (rs.hasLocalStorage() === true) {
          localStorage.setItem("wikisync-hide-completed", selected); // save in localStorage
        }
        wikisync.updateHiddenEntries();
      });

      var fieldset = new OO.ui.FieldsetLayout({
        id: "rs-qc-form",
      });

      var fieldSetItems = [
        new OO.ui.FieldLayout(input1, {}),
      ];
	  if (!leagueOnly) {
	    fieldSetItems.push(new OO.ui.FieldLayout(buttonSelect, {}));
	  }
      fieldSetItems.push(button1);
      fieldset.addItems([
        new OO.ui.HorizontalLayout({
          items: fieldSetItems,
        }),
        new OO.ui.FieldLayout(helpModalBtn, {
          label:
            "No data found. To use this, enable the WikiSync plugin in RuneLite.",
          align: "inline",
          classes: ["rs-wikisync-help"],
        }),
        new OO.ui.LabelWidget({
          label:
            "Missing some data from RuneLite for this page. Please log in to the game to re-sync.",
          classes: ["rs-wikisync-missingdata"],
        }),
        new OO.ui.FieldLayout(wikisync.hideCompletedCheckbox, {
          label: "Hide completed",
          align: "inline",
          classes: ["rs-wikisync-hide-completed"],
        }),
      ]);

      if ($(this).hasClass("lighttable")) {
        // If it's a lighttable, insert the fieldset before the table
        fieldset.$element.insertBefore(this);
      } else {
        // If not, insert it inside the element that has the class
        $(this).prepend(fieldset.$element);
      }
      // Hide all of the help elements to start with
      $(".rs-wikisync-help").hide();
      $(".rs-wikisync-missingdata").hide();
      if ($(".tbrl-tasks, .music-tracks").length === 0) {
        // only show checkbox if it's a table with hide-able tasks
        $(".rs-wikisync-hide-completed").hide();
      }
      if ($(".tbrl-tasks, .music-tracks").length === 0) {
        // only show checkbox if it's a table with hide-able tasks
        $(".rs-wikisync-hide-completed").hide();
      }
    });

    if (name) {
      // If there is a saved name, load the data for it.
      wikisync.loadData(name, gamemode);
    }
  },

  /**
   * Initialize the leagues task table page
   */
  intializeTasksPage: function () {
    wikisync.tbz_areas = {};
    window.wikisync = wikisync;
    $(".tbz-wikisync-filter").each(function () {
      $(this).find(".tbz-wikisync-filter-cell").each(function () {
        var area = $(this).data("tbz-area");
        var inital_state = true;
        if (rs.hasLocalStorage()) {
          if (localStorage.getItem("wikisync-tbz-filter-show-" + area) === "false") {
            inital_state = false;
          }
        }
        var checkbox = new OO.ui.CheckboxInputWidget({
          selected: inital_state
        });
        $(checkbox.$input).attr("id", "tbz-wikisync-checkbox-" + area);
        wikisync.tbz_areas[area] = checkbox;
        var children = $(this).children();
        var label = $("<label></label>");
        label.height("100%");
        label.css("display", "block");
        label.attr("for", "tbz-wikisync-checkbox-" + area);
        label.prepend(children);
        label.prepend(checkbox.$element);
        $(this).prepend(label);
        checkbox.on("change", function (e) {
          console.log(checkbox);
          if (rs.hasLocalStorage() === true) {
            localStorage.setItem("wikisync-tbz-filter-show-" + area, checkbox.isSelected()); // save in localStorage
          }
          wikisync.updateHiddenEntries();
        });
      });
      $(this).show();
      wikisync.updateHiddenEntries();
    });
    var show_all_regions_button = new OO.ui.ButtonInputWidget({
      label: "Show all areas"
    });
    show_all_regions_button.on("click", function () {
      $.each(wikisync.tbz_areas, function (region, checkbox) {
        checkbox.setSelected(true);
      });
    });
    $("#tbz-wikisync-show-all-regions-button").prepend(show_all_regions_button.$element);
  },

  /**
   * Updates the status text
   */
  updateStatus: function (text) {
    mw.notify(text, { tag: "wikisync" });
  },

  /**
   * Sets a cookie
   */
  setCookie: function (name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  },

  /**
   * Returns the value of a cookie, or null if it doesn't exist
   */
  getCookie: function (name) {
    var cookie = new RegExp(
        "^(?:.*;)?\\s*" + name + "\\s*=\\s*([^;]+)(?:.*)?$"
      ),
      match = document.cookie.match(cookie);

    if (match !== null) {
      return match[1];
    } else {
      return null;
    }
  },

  /**
   * Load data
   */
  loadData: function (rsn, gamemode) {
    if (!rsn) {
      wikisync.updateStatus("Invalid RSN");
      return;
    }

    var endpoint = ENDPOINTS[gamemode || "osrs"] || ENDPOINTS.osrs;
    // Hide help text if it is showing.
    $(".rs-wikisync-help").hide();
    $(".rs-wikisync-missingdata").hide();
    $(".wikisync-success").remove();

    $.ajax({
      // Get the quest data
      type: "GET",
      url: endpoint.replace("username", rsn),
      dataType: "json",
      success: function (msg) {
        var userQuests = {};
        Object.entries(msg.quests).forEach(function (q) {
          var k = q[0];
          var v = q[1];
          userQuests[k] = v;

          // Correct quest names to wiki page names
          if (k in questCorrections) {
            var correctName = questCorrections[k];
            userQuests[correctName] = v;
          }
        });
        var userSkills = {};
        Object.entries(msg.levels).forEach(function (q) {
          var k = q[0],
            v = q[1];
          userSkills[k] = v;
        });
        $("." + CLASSES.QC_ICON).remove();
        $(".wikisync-completed").show();
        $(".wikisync-completed").removeClass("wikisync-completed");
        $("<img>")
          .attr(
            "src",
            "//oldschool.runescape.wiki/images/f/fb/Yes_check.svg?00000"
          )
          .addClass("wikisync-success")
          .css("width", "20px")
          .css("height", "20px")
          .css("position", "relative")
          .insertAfter(".wikisync-lookup-button");

        var hasAllData = [
          wikisync.addQuestIcons(userQuests),
          wikisync.addQuestTable(
            userQuests,
            userSkills,
            msg.achievement_diaries
          ),
          wikisync.addDiaryTable(msg.achievement_diaries),
          wikisync.addSkillTable(userSkills),
          wikisync.addSkillIcons(userSkills),
          wikisync.addMusicTracks(msg.music_tracks),
          wikisync.addCombatAchievementTasks(msg.combat_achievements),
          wikisync.addLeagueTasks(msg.league_tasks)
        ].every(function (result) {
          return result;
        });

        if (!hasAllData) {
          $(".rs-wikisync-missingdata").show();
        }
      },
      error: function (req) {
        $("." + CLASSES.QC_ICON).remove();
        wikisync.setCheckboxText("Hide completed");
        if (
          req.responseJSON &&
          req.responseJSON.code &&
          req.responseJSON.code === "NO_USER_DATA"
        ) {
          $(".rs-wikisync-help").show();
        } else {
          wikisync.updateStatus("There was a problem loading data for " + rsn);
        }
      },
    });
  },

  /**
   * Clicks the Combat Achievement rows
   */
  addCombatAchievementTasks: function (combatAchievements) {
    var combatAchievementTable = $('table.' + CLASSES.QC_ACTIVE + '.ca-tasks');
    if (combatAchievementTable.length === 0) {
      // Page doesn't have Combat Achievement tasks on it
      return true;
    }

    if (combatAchievementTable === null) {
      return false;
    }

    var seen = {};
    combatAchievements.forEach(function (taskId) {
      seen[taskId] = true;
    });
    combatAchievementTable.each(function () {
      $(this)
        .find("tr[data-ca-task-id]")
        .each(function () {
          var task_id = $(this).data("ca-task-id");
          if (!!seen[task_id] !== $(this).hasClass("highlight-on")) {
            $(this).click();
          }
          if (seen[task_id]) {
            $(this).addClass("wikisync-completed");
          }
        });
    });

    return true;
  },

  /**
   * Clicks the music track rows
   */
  addMusicTracks: function (musicTracks) {
    var musicTable = $("table." + CLASSES.QC_ACTIVE + ".music-tracks");
    if (musicTable.length === 0) {
      // Not a music track page
      return true;
    }

    if (musicTracks === null) {
      // Missing data
      return false;
    }

    var total = 0;
    var completed = 0;
    musicTable.each(function () {
      $(this)
        .find("tr[data-music-track-name]")
        .each(function () {
          var music_track_name = $(this).data("music-track-name");
          if (!!musicTracks[music_track_name] !== $(this).hasClass("highlight-on")) {
            $(this).click();
          }
          if (musicTracks[music_track_name]) {
            $(this).addClass("wikisync-completed");
            completed++;
          }
          total++;
        });
    });
    wikisync.setCheckboxText(
      "Hide unlocked tracks (" + completed + "/" + total + " unlocked)"
    );
    wikisync.updateHiddenEntries();
    return true;
  },

  /**
   * Append a checkmark/X icon to `element`.
   */
  append_icon: function (element, completed) {
    if (completed) {
      $(element).append(icons.yes);
    } else {
      $(element).append(icons.no);
    }
  },

  /**
   * Clicks the rows in a table of question and diary tiers. Also appends icons to rows dedicated to skill training
   */
  addQuestTable: function (quests, skills, achievementDiaries) {
    function splitOnLastOccurence(str, splitOn) {
      var index = str.lastIndexOf(splitOn);
      return { before: str.slice(0, index), after: str.slice(index + 1) };
    }

    // Quest and diary completion
    $("table." + CLASSES.QC_ACTIVE + ".oqg-table tr[data-rowid]").each(function () {
      var rowID = $(this).data("rowid");
      var isAchievementDiary = rowID.includes("Diary#");

      if (isAchievementDiary) {
        // Achievement diary rowIDs are formatted as "$NAME Diary#$TIER", where "$NAME" may contain spaces.

        var diaryName = splitOnLastOccurence(rowID, " ").before;
        var diaryTier = splitOnLastOccurence(rowID, "#").after;
        if (
          diaryName in achievementDiaries &&
          diaryTier in achievementDiaries[diaryName] &&
          "complete" in achievementDiaries[diaryName][diaryTier]
        ) {
          var diaryCompleted =
            achievementDiaries[diaryName][diaryTier].complete;
          if (diaryCompleted !== null) {
            if (diaryCompleted !== $(this).hasClass("highlight-on")) {
              $(this).click();
            }
          }
        }
      } else {
        var questName = rowID;
        if (questName in quests) {
          var questCompleted = quests[questName] == 2;
          if (questCompleted !== $(this).hasClass("highlight-on")) {
            $(this).click();
          }
        }
      }
    });

    // Skill training complete
    $(
      "table." + CLASSES.QC_ACTIVE + ".oqg-table tr[data-skill][data-skill-level]"
    ).each(function () {
      var skillName = $(this).data("skill");
      skillName = skillName.charAt(0).toUpperCase() + skillName.slice(1);
      var skillLevel = $(this).data("skill-level");
      var row = $(this).find("th");
      wikisync.append_icon(row, skills[skillName] >= skillLevel);
    });
    return true;
  },

  // Clicks cells/rows in a table based on skill levels.
  addSkillTable: function (skills) {
    $(
      "table." + CLASSES.QC_ACTIVE + ".skill-table [data-skill][data-skill-level]"
    ).each(function () {
      var skillName = $(this).data("skill");
      var skillLevel = $(this).data("skill-level");
      var skillCompleted = skills[skillName] >= skillLevel;
      if (skillCompleted !== $(this).hasClass("highlight-on")) {
        $(this).click();
      }
    });
    return true;
  },

  // Clicks rows in a table based on achievement diary task completion
  addDiaryTable: function (achievementDiaries) {
    var hasAllData = true;
    $(
      "table." + CLASSES.QC_ACTIVE + ".diary-table[data-diary-name][data-diary-tier]"
    ).each(function () {
      var task_index = -1;
      var diaryName = $(this).data("diary-name");
      var diaryTier = $(this).data("diary-tier");
      $(this)
        .find("tr")
        .each(function () {
          if (task_index < 0) {
            task_index += 1;
            return;
          }
          if (
            diaryName in achievementDiaries &&
            diaryTier in achievementDiaries[diaryName] &&
            achievementDiaries[diaryName][diaryTier].tasks.length > task_index
          ) {
            var task_completed =
              achievementDiaries[diaryName][diaryTier].tasks[task_index];

            if (task_completed !== null) {
              if (task_completed !== $(this).hasClass("highlight-on")) {
                $(this).click();
              }
            } else {
              hasAllData = false;
            }
          }
          task_index += 1;
        });
    });
    return hasAllData;
  },

  /**
   * Adds the icons next to respective quests
   */
  addQuestIcons: function (quests) {
    $("." + CLASSES.QC_ACTIVE + " a").each(function () {
      if (
        $(this).html().toLowerCase() != "expand" ||
        $(this).html().toLowerCase() != "collapse"
      ) {
        var questTitle = $(this).text().trim();
        if (questTitle in quests) {
          wikisync.append_icon(this, quests[questTitle] === 2);
        }
      }
    });
    return true;
  },

  /**
   * Adds the icons next to respective skills
   */
  addSkillIcons: function (userLevels) {
    $("." + CLASSES.QC_ACTIVE + " .scp").each(function () {
      var level = $(this).data("level");
      var skill = $(this).data("skill");
      if (typeof level !== "number" || userLevels[skill] === undefined) {
        return;
      }
      wikisync.append_icon(this, userLevels[skill] >= level);
    });
    return true;
  },
  
  /**
   * Clicks the league task rows
   */
  addLeagueTasks: function (tasks) {
    var taskTables = $('table.qc-active.tbrl-tasks');
    if (taskTables.length === 0) {
      // Nothing to do...
      return true;
    }

    var seen = {};
    var total = 0;
    var completed = 0;
    $(".table-completed").remove();
    tasks.forEach(function(taskId) {
      seen[taskId] = true;
    });
    taskTables.each(function() {
      var table_total = 0;
      var table_completed = 0;
      $(this).find('tr[data-taskid]').each(function() {
        var taskid = $(this).data("taskid");
        if (!!seen[taskid] !== $(this).hasClass("highlight-on")) {
          $(this).click();
        }
        if (seen[taskid]) {
          $(this).addClass("wikisync-completed");
          table_completed++;
          completed++;
        }
        table_total++;
        total++;
      })
      if (taskTables.length > 1) {
        $(this).before($("<span class='table-completed' style='font-style: italic;'>Showing "+(table_total - table_completed)+" of "+table_total+" tasks ("+table_completed+" completed)</span>"));
      }
    })
    wikisync.setCheckboxText("Hide " + completed + " completed tasks");
    wikisync.updateHiddenEntries();
    return true;
  },
};

$(wikisync.init);
