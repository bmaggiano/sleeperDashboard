/*
  Warnings:

  - You are about to drop the `Nflverse_Play_by_Play` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "account_type" TEXT,
ADD COLUMN     "daily_limit" INTEGER;

-- DropTable
DROP TABLE "Nflverse_Play_by_Play";

-- CreateTable
CREATE TABLE "nflverse_play_by_play_2021" (
    "play_id" INTEGER NOT NULL,
    "game_id" TEXT NOT NULL,
    "old_game_id" INTEGER,
    "home_team" TEXT NOT NULL,
    "away_team" TEXT NOT NULL,
    "season_type" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "posteam" TEXT,
    "posteam_type" TEXT,
    "defteam" TEXT,
    "side_of_field" TEXT,
    "yardline" INTEGER,
    "game_date" TEXT,
    "quarter_seconds_remaining" INTEGER,
    "half_seconds_remaining" INTEGER,
    "game_seconds_remaining" INTEGER,
    "game_half" TEXT,
    "quarter_end" INTEGER,
    "drive" INTEGER,
    "sp" INTEGER,
    "qtr" INTEGER,
    "down" INTEGER,
    "goal_to_go" INTEGER,
    "time" TEXT,
    "yrdln" TEXT,
    "ydstogo" INTEGER,
    "ydsnet" INTEGER,
    "desc" TEXT,
    "play_type" TEXT,
    "yards_gained" INTEGER,
    "shotgun" INTEGER,
    "no_huddle" INTEGER,
    "qb_dropback" INTEGER,
    "qb_kneel" INTEGER,
    "qb_spike" INTEGER,
    "qb_scramble" INTEGER,
    "pass_length" TEXT,
    "pass_location" TEXT,
    "air_yards" INTEGER,
    "yards_after_catch" INTEGER,
    "run_location" TEXT,
    "run_gap" TEXT,
    "field_goal_result" TEXT,
    "kick_distance" INTEGER,
    "extra_point_result" TEXT,
    "two_point_conv_result" TEXT,
    "home_timeouts_remaining" INTEGER,
    "away_timeouts_remaining" INTEGER,
    "timeout" INTEGER,
    "timeout_team" TEXT,
    "td_team" TEXT,
    "td_player_name" TEXT,
    "td_player_id" TEXT,
    "posteam_timeouts_remaining" INTEGER,
    "defteam_timeouts_remaining" INTEGER,
    "total_home_score" INTEGER,
    "total_away_score" INTEGER,
    "posteam_score" INTEGER,
    "defteam_score" INTEGER,
    "score_differential" INTEGER,
    "posteam_score_post" INTEGER,
    "defteam_score_post" INTEGER,
    "score_differential_post" INTEGER,
    "no_score_prob" DOUBLE PRECISION,
    "opp_fg_prob" DOUBLE PRECISION,
    "opp_safety_prob" DOUBLE PRECISION,
    "opp_td_prob" DOUBLE PRECISION,
    "fg_prob" DOUBLE PRECISION,
    "safety_prob" DOUBLE PRECISION,
    "td_prob" DOUBLE PRECISION,
    "extra_point_prob" INTEGER,
    "two_point_conversion_prob" INTEGER,
    "ep" DOUBLE PRECISION,
    "epa" DOUBLE PRECISION,
    "total_home_epa" DOUBLE PRECISION,
    "total_away_epa" DOUBLE PRECISION,
    "total_home_rush_epa" DOUBLE PRECISION,
    "total_away_rush_epa" DOUBLE PRECISION,
    "total_home_pass_epa" DOUBLE PRECISION,
    "total_away_pass_epa" DOUBLE PRECISION,
    "air_epa" DOUBLE PRECISION,
    "yac_epa" DOUBLE PRECISION,
    "comp_air_epa" DOUBLE PRECISION,
    "comp_yac_epa" DOUBLE PRECISION,
    "total_home_comp_air_epa" DOUBLE PRECISION,
    "total_away_comp_air_epa" DOUBLE PRECISION,
    "total_home_comp_yac_epa" DOUBLE PRECISION,
    "total_away_comp_yac_epa" DOUBLE PRECISION,
    "total_home_raw_air_epa" DOUBLE PRECISION,
    "total_away_raw_air_epa" DOUBLE PRECISION,
    "total_home_raw_yac_epa" DOUBLE PRECISION,
    "total_away_raw_yac_epa" DOUBLE PRECISION,
    "wp" DOUBLE PRECISION,
    "def_wp" DOUBLE PRECISION,
    "home_wp" DOUBLE PRECISION,
    "away_wp" DOUBLE PRECISION,
    "wpa" DOUBLE PRECISION,
    "vegas_wpa" DOUBLE PRECISION,
    "vegas_home_wpa" DOUBLE PRECISION,
    "home_wp_post" DOUBLE PRECISION,
    "away_wp_post" DOUBLE PRECISION,
    "vegas_wp" DOUBLE PRECISION,
    "vegas_home_wp" DOUBLE PRECISION,
    "total_home_rush_wpa" DOUBLE PRECISION,
    "total_away_rush_wpa" DOUBLE PRECISION,
    "total_home_pass_wpa" DOUBLE PRECISION,
    "total_away_pass_wpa" DOUBLE PRECISION,
    "air_wpa" DOUBLE PRECISION,
    "yac_wpa" DOUBLE PRECISION,
    "comp_air_wpa" DOUBLE PRECISION,
    "comp_yac_wpa" DOUBLE PRECISION,
    "total_home_comp_air_wpa" DOUBLE PRECISION,
    "total_away_comp_air_wpa" DOUBLE PRECISION,
    "total_home_comp_yac_wpa" DOUBLE PRECISION,
    "total_away_comp_yac_wpa" DOUBLE PRECISION,
    "total_home_raw_air_wpa" DOUBLE PRECISION,
    "total_away_raw_air_wpa" DOUBLE PRECISION,
    "total_home_raw_yac_wpa" DOUBLE PRECISION,
    "total_away_raw_yac_wpa" DOUBLE PRECISION,
    "punt_blocked" INTEGER,
    "first_down_rush" INTEGER,
    "first_down_pass" INTEGER,
    "first_down_penalty" INTEGER,
    "third_down_converted" INTEGER,
    "third_down_failed" INTEGER,
    "fourth_down_converted" INTEGER,
    "fourth_down_failed" INTEGER,
    "incomplete_pass" INTEGER,
    "touchback" INTEGER,
    "interception" INTEGER,
    "punt_inside_twenty" INTEGER,
    "punt_in_endzone" INTEGER,
    "punt_out_of_bounds" INTEGER,
    "punt_downed" INTEGER,
    "punt_fair_catch" INTEGER,
    "kickoff_inside_twenty" INTEGER,
    "kickoff_in_endzone" INTEGER,
    "kickoff_out_of_bounds" INTEGER,
    "kickoff_downed" INTEGER,
    "kickoff_fair_catch" INTEGER,
    "fumble_forced" INTEGER,
    "fumble_not_forced" INTEGER,
    "fumble_out_of_bounds" INTEGER,
    "solo_tackle" INTEGER,
    "safety" INTEGER,
    "penalty" INTEGER,
    "tackled_for_loss" INTEGER,
    "fumble_lost" INTEGER,
    "own_kickoff_recovery" INTEGER,
    "own_kickoff_recovery_td" INTEGER,
    "qb_hit" INTEGER,
    "rush_attempt" INTEGER,
    "pass_attempt" INTEGER,
    "sack" INTEGER,
    "touchdown" INTEGER,
    "pass_touchdown" INTEGER,
    "rush_touchdown" INTEGER,
    "return_touchdown" INTEGER,
    "extra_point_attempt" INTEGER,
    "two_point_attempt" INTEGER,
    "field_goal_attempt" INTEGER,
    "kickoff_attempt" INTEGER,
    "punt_attempt" INTEGER,
    "fumble" INTEGER,
    "complete_pass" INTEGER,
    "assist_tackle" INTEGER,
    "lateral_reception" INTEGER,
    "lateral_rush" INTEGER,
    "lateral_return" INTEGER,
    "lateral_recovery" INTEGER,
    "passer_player_id" TEXT,
    "passer_player_name" TEXT,
    "passing_yards" INTEGER,
    "receiver_player_id" TEXT,
    "receiver_player_name" TEXT,
    "receiving_yards" INTEGER,
    "rusher_player_id" TEXT,
    "rusher_player_name" TEXT,
    "rushing_yards" INTEGER,
    "lateral_receiver_player_id" TEXT,
    "lateral_receiver_player_name" TEXT,
    "lateral_receiving_yards" TEXT,
    "lateral_rusher_player_id" TEXT,
    "lateral_rusher_player_name" TEXT,
    "lateral_rushing_yards" TEXT,
    "lateral_sack_player_id" TEXT,
    "lateral_sack_player_name" TEXT,
    "interception_player_id" TEXT,
    "interception_player_name" TEXT,
    "lateral_interception_player_id" TEXT,
    "lateral_interception_player_name" TEXT,
    "punt_returner_player_id" TEXT,
    "punt_returner_player_name" TEXT,
    "lateral_punt_returner_player_id" TEXT,
    "lateral_punt_returner_player_name" TEXT,
    "kickoff_returner_player_name" TEXT,
    "kickoff_returner_player_id" TEXT,
    "lateral_kickoff_returner_player_id" TEXT,
    "lateral_kickoff_returner_player_name" TEXT,
    "punter_player_id" TEXT,
    "punter_player_name" TEXT,
    "kicker_player_name" TEXT,
    "kicker_player_id" TEXT,
    "own_kickoff_recovery_player_id" TEXT,
    "own_kickoff_recovery_player_name" TEXT,
    "blocked_player_id" TEXT,
    "blocked_player_name" TEXT,
    "tackle_for_loss_1_player_id" TEXT,
    "tackle_for_loss_1_player_name" TEXT,
    "tackle_for_loss_2_player_id" TEXT,
    "tackle_for_loss_2_player_name" TEXT,
    "qb_hit_1_player_id" TEXT,
    "qb_hit_1_player_name" TEXT,
    "qb_hit_2_player_id" TEXT,
    "qb_hit_2_player_name" TEXT,
    "forced_fumble_player_1_team" TEXT,
    "forced_fumble_player_1_player_id" TEXT,
    "forced_fumble_player_1_player_name" TEXT,
    "forced_fumble_player_2_team" TEXT,
    "forced_fumble_player_2_player_id" TEXT,
    "forced_fumble_player_2_player_name" TEXT,
    "solo_tackle_1_team" TEXT,
    "solo_tackle_2_team" TEXT,
    "solo_tackle_1_player_id" TEXT,
    "solo_tackle_2_player_id" TEXT,
    "solo_tackle_1_player_name" TEXT,
    "solo_tackle_2_player_name" TEXT,
    "assist_tackle_1_player_id" TEXT,
    "assist_tackle_1_player_name" TEXT,
    "assist_tackle_1_team" TEXT,
    "assist_tackle_2_player_id" TEXT,
    "assist_tackle_2_player_name" TEXT,
    "assist_tackle_2_team" TEXT,
    "assist_tackle_3_player_id" TEXT,
    "assist_tackle_3_player_name" TEXT,
    "assist_tackle_3_team" TEXT,
    "assist_tackle_4_player_id" TEXT,
    "assist_tackle_4_player_name" TEXT,
    "assist_tackle_4_team" TEXT,
    "tackle_with_assist" INTEGER,
    "tackle_with_assist_1_player_id" TEXT,
    "tackle_with_assist_1_player_name" TEXT,
    "tackle_with_assist_1_team" TEXT,
    "tackle_with_assist_2_player_id" TEXT,
    "tackle_with_assist_2_player_name" TEXT,
    "tackle_with_assist_2_team" TEXT,
    "pass_defense_1_player_id" TEXT,
    "pass_defense_1_player_name" TEXT,
    "pass_defense_2_player_id" TEXT,
    "pass_defense_2_player_name" TEXT,
    "fumbled_1_team" TEXT,
    "fumbled_1_player_id" TEXT,
    "fumbled_1_player_name" TEXT,
    "fumbled_2_player_id" TEXT,
    "fumbled_2_player_name" TEXT,
    "fumbled_2_team" TEXT,
    "fumble_recovery_1_team" TEXT,
    "fumble_recovery_1_yards" TEXT,
    "fumble_recovery_1_player_id" TEXT,
    "fumble_recovery_1_player_name" TEXT,
    "fumble_recovery_2_team" TEXT,
    "fumble_recovery_2_yards" TEXT,
    "fumble_recovery_2_player_id" TEXT,
    "fumble_recovery_2_player_name" TEXT,
    "sack_player_id" TEXT,
    "sack_player_name" TEXT,
    "half_sack_1_player_id" TEXT,
    "half_sack_1_player_name" TEXT,
    "half_sack_2_player_id" TEXT,
    "half_sack_2_player_name" TEXT,
    "return_team" TEXT,
    "return_yards" INTEGER,
    "penalty_team" TEXT,
    "penalty_player_id" TEXT,
    "penalty_player_name" TEXT,
    "penalty_yards" TEXT,
    "replay_or_challenge" INTEGER,
    "replay_or_challenge_result" TEXT,
    "penalty_type" TEXT,
    "defensive_two_point_attempt" INTEGER,
    "defensive_two_point_conv" INTEGER,
    "defensive_extra_point_attempt" INTEGER,
    "defensive_extra_point_conv" INTEGER,
    "safety_player_name" TEXT,
    "safety_player_id" TEXT,
    "season" INTEGER,
    "cp" DOUBLE PRECISION,
    "cpoe" DOUBLE PRECISION,
    "series" INTEGER,
    "series_success" INTEGER,
    "series_result" TEXT,
    "order_sequence" INTEGER,
    "start_time" TEXT,
    "time_of_day" TEXT,
    "stadium" TEXT,
    "weather" TEXT,
    "nfl_api_id" TEXT,
    "play_clock" TEXT,
    "play_deleted" TEXT,
    "play_type_nfl" TEXT,
    "special_teams_play" TEXT,
    "st_play_type" TEXT,
    "end_clock_time" TEXT,
    "end_yard_line" TEXT,
    "fixed_drive" TEXT,
    "fixed_drive_result" TEXT,
    "drive_real_start_time" TEXT,
    "drive_play_count" TEXT,
    "drive_time_of_possession" TEXT,
    "drive_first_downs" TEXT,
    "drive_inside20" TEXT,
    "drive_ended_with_score" TEXT,
    "drive_quarter_start" TEXT,
    "drive_quarter_end" TEXT,
    "drive_yards_penalized" TEXT,
    "drive_start_transition" TEXT,
    "drive_end_transition" TEXT,
    "drive_game_clock_start" TEXT,
    "drive_game_clock_end" TEXT,
    "drive_start_yard_line" TEXT,
    "drive_end_yard_line" TEXT,
    "drive_play_id_started" TEXT,
    "drive_play_id_ended" TEXT,
    "away_score" TEXT,
    "home_score" TEXT,
    "location" TEXT,
    "result" TEXT,
    "total" TEXT,
    "spread_line" TEXT,
    "total_line" TEXT,
    "div_game" TEXT,
    "roof" TEXT,
    "surface" TEXT,
    "temp" TEXT,
    "wind" TEXT,
    "home_coach" TEXT,
    "away_coach" TEXT,
    "stadium_id" TEXT,
    "game_stadium" TEXT,
    "aborted_play" TEXT,
    "success" TEXT,
    "passer" TEXT,
    "passer_jersey_number" TEXT,
    "rusher" TEXT,
    "rusher_jersey_number" TEXT,
    "receiver" TEXT,
    "receiver_jersey_number" TEXT,
    "pass" TEXT,
    "rush" TEXT,
    "first_down" TEXT,
    "special" TEXT,
    "play" TEXT,
    "passer_id" TEXT,
    "rusher_id" TEXT,
    "receiver_id" TEXT,
    "name" TEXT,
    "jersey_number" TEXT,
    "fantasy_player_name" TEXT,
    "fantasy_player_id" TEXT,
    "fantasy" TEXT,
    "fantasy_id" TEXT,
    "out_of_bounds" TEXT,
    "home_opening_kickoff" TEXT,
    "qb_epa" TEXT,
    "xyac_epa" TEXT,
    "xyac_mean_yardage" TEXT,
    "xyac_median_yardage" TEXT,
    "xyac_success" TEXT,
    "xyac_fd" TEXT,
    "xpass" TEXT,
    "pass_oe" TEXT,

    CONSTRAINT "Nflverse_Play_by_Play_2021_pkey" PRIMARY KEY ("play_id","game_id","home_team","away_team","season_type","week")
);

-- CreateTable
CREATE TABLE "nflverse_play_by_play_2022" (
    "play_id" INTEGER NOT NULL,
    "game_id" TEXT NOT NULL,
    "old_game_id" INTEGER,
    "home_team" TEXT NOT NULL,
    "away_team" TEXT NOT NULL,
    "season_type" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "posteam" TEXT,
    "posteam_type" TEXT,
    "defteam" TEXT,
    "side_of_field" TEXT,
    "yardline" INTEGER,
    "game_date" TEXT,
    "quarter_seconds_remaining" INTEGER,
    "half_seconds_remaining" INTEGER,
    "game_seconds_remaining" INTEGER,
    "game_half" TEXT,
    "quarter_end" INTEGER,
    "drive" INTEGER,
    "sp" INTEGER,
    "qtr" INTEGER,
    "down" INTEGER,
    "goal_to_go" INTEGER,
    "time" TEXT,
    "yrdln" TEXT,
    "ydstogo" INTEGER,
    "ydsnet" INTEGER,
    "desc" TEXT,
    "play_type" TEXT,
    "yards_gained" INTEGER,
    "shotgun" INTEGER,
    "no_huddle" INTEGER,
    "qb_dropback" INTEGER,
    "qb_kneel" INTEGER,
    "qb_spike" INTEGER,
    "qb_scramble" INTEGER,
    "pass_length" TEXT,
    "pass_location" TEXT,
    "air_yards" INTEGER,
    "yards_after_catch" INTEGER,
    "run_location" TEXT,
    "run_gap" TEXT,
    "field_goal_result" TEXT,
    "kick_distance" INTEGER,
    "extra_point_result" TEXT,
    "two_point_conv_result" TEXT,
    "home_timeouts_remaining" INTEGER,
    "away_timeouts_remaining" INTEGER,
    "timeout" INTEGER,
    "timeout_team" TEXT,
    "td_team" TEXT,
    "td_player_name" TEXT,
    "td_player_id" TEXT,
    "posteam_timeouts_remaining" INTEGER,
    "defteam_timeouts_remaining" INTEGER,
    "total_home_score" INTEGER,
    "total_away_score" INTEGER,
    "posteam_score" INTEGER,
    "defteam_score" INTEGER,
    "score_differential" INTEGER,
    "posteam_score_post" INTEGER,
    "defteam_score_post" INTEGER,
    "score_differential_post" INTEGER,
    "no_score_prob" DOUBLE PRECISION,
    "opp_fg_prob" DOUBLE PRECISION,
    "opp_safety_prob" DOUBLE PRECISION,
    "opp_td_prob" DOUBLE PRECISION,
    "fg_prob" DOUBLE PRECISION,
    "safety_prob" DOUBLE PRECISION,
    "td_prob" DOUBLE PRECISION,
    "extra_point_prob" INTEGER,
    "two_point_conversion_prob" INTEGER,
    "ep" DOUBLE PRECISION,
    "epa" DOUBLE PRECISION,
    "total_home_epa" DOUBLE PRECISION,
    "total_away_epa" DOUBLE PRECISION,
    "total_home_rush_epa" DOUBLE PRECISION,
    "total_away_rush_epa" DOUBLE PRECISION,
    "total_home_pass_epa" DOUBLE PRECISION,
    "total_away_pass_epa" DOUBLE PRECISION,
    "air_epa" DOUBLE PRECISION,
    "yac_epa" DOUBLE PRECISION,
    "comp_air_epa" DOUBLE PRECISION,
    "comp_yac_epa" DOUBLE PRECISION,
    "total_home_comp_air_epa" DOUBLE PRECISION,
    "total_away_comp_air_epa" DOUBLE PRECISION,
    "total_home_comp_yac_epa" DOUBLE PRECISION,
    "total_away_comp_yac_epa" DOUBLE PRECISION,
    "total_home_raw_air_epa" DOUBLE PRECISION,
    "total_away_raw_air_epa" DOUBLE PRECISION,
    "total_home_raw_yac_epa" DOUBLE PRECISION,
    "total_away_raw_yac_epa" DOUBLE PRECISION,
    "wp" DOUBLE PRECISION,
    "def_wp" DOUBLE PRECISION,
    "home_wp" DOUBLE PRECISION,
    "away_wp" DOUBLE PRECISION,
    "wpa" DOUBLE PRECISION,
    "vegas_wpa" DOUBLE PRECISION,
    "vegas_home_wpa" DOUBLE PRECISION,
    "home_wp_post" DOUBLE PRECISION,
    "away_wp_post" DOUBLE PRECISION,
    "vegas_wp" DOUBLE PRECISION,
    "vegas_home_wp" DOUBLE PRECISION,
    "total_home_rush_wpa" DOUBLE PRECISION,
    "total_away_rush_wpa" DOUBLE PRECISION,
    "total_home_pass_wpa" DOUBLE PRECISION,
    "total_away_pass_wpa" DOUBLE PRECISION,
    "air_wpa" DOUBLE PRECISION,
    "yac_wpa" DOUBLE PRECISION,
    "comp_air_wpa" DOUBLE PRECISION,
    "comp_yac_wpa" DOUBLE PRECISION,
    "total_home_comp_air_wpa" DOUBLE PRECISION,
    "total_away_comp_air_wpa" DOUBLE PRECISION,
    "total_home_comp_yac_wpa" DOUBLE PRECISION,
    "total_away_comp_yac_wpa" DOUBLE PRECISION,
    "total_home_raw_air_wpa" DOUBLE PRECISION,
    "total_away_raw_air_wpa" DOUBLE PRECISION,
    "total_home_raw_yac_wpa" DOUBLE PRECISION,
    "total_away_raw_yac_wpa" DOUBLE PRECISION,
    "punt_blocked" INTEGER,
    "first_down_rush" INTEGER,
    "first_down_pass" INTEGER,
    "first_down_penalty" INTEGER,
    "third_down_converted" INTEGER,
    "third_down_failed" INTEGER,
    "fourth_down_converted" INTEGER,
    "fourth_down_failed" INTEGER,
    "incomplete_pass" INTEGER,
    "touchback" INTEGER,
    "interception" INTEGER,
    "punt_inside_twenty" INTEGER,
    "punt_in_endzone" INTEGER,
    "punt_out_of_bounds" INTEGER,
    "punt_downed" INTEGER,
    "punt_fair_catch" INTEGER,
    "kickoff_inside_twenty" INTEGER,
    "kickoff_in_endzone" INTEGER,
    "kickoff_out_of_bounds" INTEGER,
    "kickoff_downed" INTEGER,
    "kickoff_fair_catch" INTEGER,
    "fumble_forced" INTEGER,
    "fumble_not_forced" INTEGER,
    "fumble_out_of_bounds" INTEGER,
    "solo_tackle" INTEGER,
    "safety" INTEGER,
    "penalty" INTEGER,
    "tackled_for_loss" INTEGER,
    "fumble_lost" INTEGER,
    "own_kickoff_recovery" INTEGER,
    "own_kickoff_recovery_td" INTEGER,
    "qb_hit" INTEGER,
    "rush_attempt" INTEGER,
    "pass_attempt" INTEGER,
    "sack" INTEGER,
    "touchdown" INTEGER,
    "pass_touchdown" INTEGER,
    "rush_touchdown" INTEGER,
    "return_touchdown" INTEGER,
    "extra_point_attempt" INTEGER,
    "two_point_attempt" INTEGER,
    "field_goal_attempt" INTEGER,
    "kickoff_attempt" INTEGER,
    "punt_attempt" INTEGER,
    "fumble" INTEGER,
    "complete_pass" INTEGER,
    "assist_tackle" INTEGER,
    "lateral_reception" INTEGER,
    "lateral_rush" INTEGER,
    "lateral_return" INTEGER,
    "lateral_recovery" INTEGER,
    "passer_player_id" TEXT,
    "passer_player_name" TEXT,
    "passing_yards" INTEGER,
    "receiver_player_id" TEXT,
    "receiver_player_name" TEXT,
    "receiving_yards" INTEGER,
    "rusher_player_id" TEXT,
    "rusher_player_name" TEXT,
    "rushing_yards" INTEGER,
    "lateral_receiver_player_id" TEXT,
    "lateral_receiver_player_name" TEXT,
    "lateral_receiving_yards" TEXT,
    "lateral_rusher_player_id" TEXT,
    "lateral_rusher_player_name" TEXT,
    "lateral_rushing_yards" TEXT,
    "lateral_sack_player_id" TEXT,
    "lateral_sack_player_name" TEXT,
    "interception_player_id" TEXT,
    "interception_player_name" TEXT,
    "lateral_interception_player_id" TEXT,
    "lateral_interception_player_name" TEXT,
    "punt_returner_player_id" TEXT,
    "punt_returner_player_name" TEXT,
    "lateral_punt_returner_player_id" TEXT,
    "lateral_punt_returner_player_name" TEXT,
    "kickoff_returner_player_name" TEXT,
    "kickoff_returner_player_id" TEXT,
    "lateral_kickoff_returner_player_id" TEXT,
    "lateral_kickoff_returner_player_name" TEXT,
    "punter_player_id" TEXT,
    "punter_player_name" TEXT,
    "kicker_player_name" TEXT,
    "kicker_player_id" TEXT,
    "own_kickoff_recovery_player_id" TEXT,
    "own_kickoff_recovery_player_name" TEXT,
    "blocked_player_id" TEXT,
    "blocked_player_name" TEXT,
    "tackle_for_loss_1_player_id" TEXT,
    "tackle_for_loss_1_player_name" TEXT,
    "tackle_for_loss_2_player_id" TEXT,
    "tackle_for_loss_2_player_name" TEXT,
    "qb_hit_1_player_id" TEXT,
    "qb_hit_1_player_name" TEXT,
    "qb_hit_2_player_id" TEXT,
    "qb_hit_2_player_name" TEXT,
    "forced_fumble_player_1_team" TEXT,
    "forced_fumble_player_1_player_id" TEXT,
    "forced_fumble_player_1_player_name" TEXT,
    "forced_fumble_player_2_team" TEXT,
    "forced_fumble_player_2_player_id" TEXT,
    "forced_fumble_player_2_player_name" TEXT,
    "solo_tackle_1_team" TEXT,
    "solo_tackle_2_team" TEXT,
    "solo_tackle_1_player_id" TEXT,
    "solo_tackle_2_player_id" TEXT,
    "solo_tackle_1_player_name" TEXT,
    "solo_tackle_2_player_name" TEXT,
    "assist_tackle_1_player_id" TEXT,
    "assist_tackle_1_player_name" TEXT,
    "assist_tackle_1_team" TEXT,
    "assist_tackle_2_player_id" TEXT,
    "assist_tackle_2_player_name" TEXT,
    "assist_tackle_2_team" TEXT,
    "assist_tackle_3_player_id" TEXT,
    "assist_tackle_3_player_name" TEXT,
    "assist_tackle_3_team" TEXT,
    "assist_tackle_4_player_id" TEXT,
    "assist_tackle_4_player_name" TEXT,
    "assist_tackle_4_team" TEXT,
    "tackle_with_assist" INTEGER,
    "tackle_with_assist_1_player_id" TEXT,
    "tackle_with_assist_1_player_name" TEXT,
    "tackle_with_assist_1_team" TEXT,
    "tackle_with_assist_2_player_id" TEXT,
    "tackle_with_assist_2_player_name" TEXT,
    "tackle_with_assist_2_team" TEXT,
    "pass_defense_1_player_id" TEXT,
    "pass_defense_1_player_name" TEXT,
    "pass_defense_2_player_id" TEXT,
    "pass_defense_2_player_name" TEXT,
    "fumbled_1_team" TEXT,
    "fumbled_1_player_id" TEXT,
    "fumbled_1_player_name" TEXT,
    "fumbled_2_player_id" TEXT,
    "fumbled_2_player_name" TEXT,
    "fumbled_2_team" TEXT,
    "fumble_recovery_1_team" TEXT,
    "fumble_recovery_1_yards" TEXT,
    "fumble_recovery_1_player_id" TEXT,
    "fumble_recovery_1_player_name" TEXT,
    "fumble_recovery_2_team" TEXT,
    "fumble_recovery_2_yards" TEXT,
    "fumble_recovery_2_player_id" TEXT,
    "fumble_recovery_2_player_name" TEXT,
    "sack_player_id" TEXT,
    "sack_player_name" TEXT,
    "half_sack_1_player_id" TEXT,
    "half_sack_1_player_name" TEXT,
    "half_sack_2_player_id" TEXT,
    "half_sack_2_player_name" TEXT,
    "return_team" TEXT,
    "return_yards" INTEGER,
    "penalty_team" TEXT,
    "penalty_player_id" TEXT,
    "penalty_player_name" TEXT,
    "penalty_yards" TEXT,
    "replay_or_challenge" INTEGER,
    "replay_or_challenge_result" TEXT,
    "penalty_type" TEXT,
    "defensive_two_point_attempt" INTEGER,
    "defensive_two_point_conv" INTEGER,
    "defensive_extra_point_attempt" INTEGER,
    "defensive_extra_point_conv" INTEGER,
    "safety_player_name" TEXT,
    "safety_player_id" TEXT,
    "season" INTEGER,
    "cp" DOUBLE PRECISION,
    "cpoe" DOUBLE PRECISION,
    "series" INTEGER,
    "series_success" INTEGER,
    "series_result" TEXT,
    "order_sequence" INTEGER,
    "start_time" TEXT,
    "time_of_day" TEXT,
    "stadium" TEXT,
    "weather" TEXT,
    "nfl_api_id" TEXT,
    "play_clock" TEXT,
    "play_deleted" TEXT,
    "play_type_nfl" TEXT,
    "special_teams_play" TEXT,
    "st_play_type" TEXT,
    "end_clock_time" TEXT,
    "end_yard_line" TEXT,
    "fixed_drive" TEXT,
    "fixed_drive_result" TEXT,
    "drive_real_start_time" TEXT,
    "drive_play_count" TEXT,
    "drive_time_of_possession" TEXT,
    "drive_first_downs" TEXT,
    "drive_inside20" TEXT,
    "drive_ended_with_score" TEXT,
    "drive_quarter_start" TEXT,
    "drive_quarter_end" TEXT,
    "drive_yards_penalized" TEXT,
    "drive_start_transition" TEXT,
    "drive_end_transition" TEXT,
    "drive_game_clock_start" TEXT,
    "drive_game_clock_end" TEXT,
    "drive_start_yard_line" TEXT,
    "drive_end_yard_line" TEXT,
    "drive_play_id_started" TEXT,
    "drive_play_id_ended" TEXT,
    "away_score" TEXT,
    "home_score" TEXT,
    "location" TEXT,
    "result" TEXT,
    "total" TEXT,
    "spread_line" TEXT,
    "total_line" TEXT,
    "div_game" TEXT,
    "roof" TEXT,
    "surface" TEXT,
    "temp" TEXT,
    "wind" TEXT,
    "home_coach" TEXT,
    "away_coach" TEXT,
    "stadium_id" TEXT,
    "game_stadium" TEXT,
    "aborted_play" TEXT,
    "success" TEXT,
    "passer" TEXT,
    "passer_jersey_number" TEXT,
    "rusher" TEXT,
    "rusher_jersey_number" TEXT,
    "receiver" TEXT,
    "receiver_jersey_number" TEXT,
    "pass" TEXT,
    "rush" TEXT,
    "first_down" TEXT,
    "special" TEXT,
    "play" TEXT,
    "passer_id" TEXT,
    "rusher_id" TEXT,
    "receiver_id" TEXT,
    "name" TEXT,
    "jersey_number" TEXT,
    "fantasy_player_name" TEXT,
    "fantasy_player_id" TEXT,
    "fantasy" TEXT,
    "fantasy_id" TEXT,
    "out_of_bounds" TEXT,
    "home_opening_kickoff" TEXT,
    "qb_epa" TEXT,
    "xyac_epa" TEXT,
    "xyac_mean_yardage" TEXT,
    "xyac_median_yardage" TEXT,
    "xyac_success" TEXT,
    "xyac_fd" TEXT,
    "xpass" TEXT,
    "pass_oe" TEXT,

    CONSTRAINT "Nflverse_Play_by_Play_2022_pkey" PRIMARY KEY ("play_id","game_id","home_team","away_team","season_type","week")
);

-- CreateTable
CREATE TABLE "nflverse_play_by_play_2023" (
    "play_id" INTEGER NOT NULL,
    "game_id" TEXT NOT NULL,
    "old_game_id" INTEGER,
    "home_team" TEXT NOT NULL,
    "away_team" TEXT NOT NULL,
    "season_type" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "posteam" TEXT,
    "posteam_type" TEXT,
    "defteam" TEXT,
    "side_of_field" TEXT,
    "yardline" INTEGER,
    "game_date" TEXT,
    "quarter_seconds_remaining" INTEGER,
    "half_seconds_remaining" INTEGER,
    "game_seconds_remaining" INTEGER,
    "game_half" TEXT,
    "quarter_end" INTEGER,
    "drive" INTEGER,
    "sp" INTEGER,
    "qtr" INTEGER,
    "down" INTEGER,
    "goal_to_go" INTEGER,
    "time" TEXT,
    "yrdln" TEXT,
    "ydstogo" INTEGER,
    "ydsnet" INTEGER,
    "desc" TEXT,
    "play_type" TEXT,
    "yards_gained" INTEGER,
    "shotgun" INTEGER,
    "no_huddle" INTEGER,
    "qb_dropback" INTEGER,
    "qb_kneel" INTEGER,
    "qb_spike" INTEGER,
    "qb_scramble" INTEGER,
    "pass_length" TEXT,
    "pass_location" TEXT,
    "air_yards" INTEGER,
    "yards_after_catch" INTEGER,
    "run_location" TEXT,
    "run_gap" TEXT,
    "field_goal_result" TEXT,
    "kick_distance" INTEGER,
    "extra_point_result" TEXT,
    "two_point_conv_result" TEXT,
    "home_timeouts_remaining" INTEGER,
    "away_timeouts_remaining" INTEGER,
    "timeout" INTEGER,
    "timeout_team" TEXT,
    "td_team" TEXT,
    "td_player_name" TEXT,
    "td_player_id" TEXT,
    "posteam_timeouts_remaining" INTEGER,
    "defteam_timeouts_remaining" INTEGER,
    "total_home_score" INTEGER,
    "total_away_score" INTEGER,
    "posteam_score" INTEGER,
    "defteam_score" INTEGER,
    "score_differential" INTEGER,
    "posteam_score_post" INTEGER,
    "defteam_score_post" INTEGER,
    "score_differential_post" INTEGER,
    "no_score_prob" DOUBLE PRECISION,
    "opp_fg_prob" DOUBLE PRECISION,
    "opp_safety_prob" DOUBLE PRECISION,
    "opp_td_prob" DOUBLE PRECISION,
    "fg_prob" DOUBLE PRECISION,
    "safety_prob" DOUBLE PRECISION,
    "td_prob" DOUBLE PRECISION,
    "extra_point_prob" INTEGER,
    "two_point_conversion_prob" INTEGER,
    "ep" DOUBLE PRECISION,
    "epa" DOUBLE PRECISION,
    "total_home_epa" DOUBLE PRECISION,
    "total_away_epa" DOUBLE PRECISION,
    "total_home_rush_epa" DOUBLE PRECISION,
    "total_away_rush_epa" DOUBLE PRECISION,
    "total_home_pass_epa" DOUBLE PRECISION,
    "total_away_pass_epa" DOUBLE PRECISION,
    "air_epa" DOUBLE PRECISION,
    "yac_epa" DOUBLE PRECISION,
    "comp_air_epa" DOUBLE PRECISION,
    "comp_yac_epa" DOUBLE PRECISION,
    "total_home_comp_air_epa" DOUBLE PRECISION,
    "total_away_comp_air_epa" DOUBLE PRECISION,
    "total_home_comp_yac_epa" DOUBLE PRECISION,
    "total_away_comp_yac_epa" DOUBLE PRECISION,
    "total_home_raw_air_epa" DOUBLE PRECISION,
    "total_away_raw_air_epa" DOUBLE PRECISION,
    "total_home_raw_yac_epa" DOUBLE PRECISION,
    "total_away_raw_yac_epa" DOUBLE PRECISION,
    "wp" DOUBLE PRECISION,
    "def_wp" DOUBLE PRECISION,
    "home_wp" DOUBLE PRECISION,
    "away_wp" DOUBLE PRECISION,
    "wpa" DOUBLE PRECISION,
    "vegas_wpa" DOUBLE PRECISION,
    "vegas_home_wpa" DOUBLE PRECISION,
    "home_wp_post" DOUBLE PRECISION,
    "away_wp_post" DOUBLE PRECISION,
    "vegas_wp" DOUBLE PRECISION,
    "vegas_home_wp" DOUBLE PRECISION,
    "total_home_rush_wpa" DOUBLE PRECISION,
    "total_away_rush_wpa" DOUBLE PRECISION,
    "total_home_pass_wpa" DOUBLE PRECISION,
    "total_away_pass_wpa" DOUBLE PRECISION,
    "air_wpa" DOUBLE PRECISION,
    "yac_wpa" DOUBLE PRECISION,
    "comp_air_wpa" DOUBLE PRECISION,
    "comp_yac_wpa" DOUBLE PRECISION,
    "total_home_comp_air_wpa" DOUBLE PRECISION,
    "total_away_comp_air_wpa" DOUBLE PRECISION,
    "total_home_comp_yac_wpa" DOUBLE PRECISION,
    "total_away_comp_yac_wpa" DOUBLE PRECISION,
    "total_home_raw_air_wpa" DOUBLE PRECISION,
    "total_away_raw_air_wpa" DOUBLE PRECISION,
    "total_home_raw_yac_wpa" DOUBLE PRECISION,
    "total_away_raw_yac_wpa" DOUBLE PRECISION,
    "punt_blocked" INTEGER,
    "first_down_rush" INTEGER,
    "first_down_pass" INTEGER,
    "first_down_penalty" INTEGER,
    "third_down_converted" INTEGER,
    "third_down_failed" INTEGER,
    "fourth_down_converted" INTEGER,
    "fourth_down_failed" INTEGER,
    "incomplete_pass" INTEGER,
    "touchback" INTEGER,
    "interception" INTEGER,
    "punt_inside_twenty" INTEGER,
    "punt_in_endzone" INTEGER,
    "punt_out_of_bounds" INTEGER,
    "punt_downed" INTEGER,
    "punt_fair_catch" INTEGER,
    "kickoff_inside_twenty" INTEGER,
    "kickoff_in_endzone" INTEGER,
    "kickoff_out_of_bounds" INTEGER,
    "kickoff_downed" INTEGER,
    "kickoff_fair_catch" INTEGER,
    "fumble_forced" INTEGER,
    "fumble_not_forced" INTEGER,
    "fumble_out_of_bounds" INTEGER,
    "solo_tackle" INTEGER,
    "safety" INTEGER,
    "penalty" INTEGER,
    "tackled_for_loss" INTEGER,
    "fumble_lost" INTEGER,
    "own_kickoff_recovery" INTEGER,
    "own_kickoff_recovery_td" INTEGER,
    "qb_hit" INTEGER,
    "rush_attempt" INTEGER,
    "pass_attempt" INTEGER,
    "sack" INTEGER,
    "touchdown" INTEGER,
    "pass_touchdown" INTEGER,
    "rush_touchdown" INTEGER,
    "return_touchdown" INTEGER,
    "extra_point_attempt" INTEGER,
    "two_point_attempt" INTEGER,
    "field_goal_attempt" INTEGER,
    "kickoff_attempt" INTEGER,
    "punt_attempt" INTEGER,
    "fumble" INTEGER,
    "complete_pass" INTEGER,
    "assist_tackle" INTEGER,
    "lateral_reception" INTEGER,
    "lateral_rush" INTEGER,
    "lateral_return" INTEGER,
    "lateral_recovery" INTEGER,
    "passer_player_id" TEXT,
    "passer_player_name" TEXT,
    "passing_yards" INTEGER,
    "receiver_player_id" TEXT,
    "receiver_player_name" TEXT,
    "receiving_yards" INTEGER,
    "rusher_player_id" TEXT,
    "rusher_player_name" TEXT,
    "rushing_yards" INTEGER,
    "lateral_receiver_player_id" TEXT,
    "lateral_receiver_player_name" TEXT,
    "lateral_receiving_yards" TEXT,
    "lateral_rusher_player_id" TEXT,
    "lateral_rusher_player_name" TEXT,
    "lateral_rushing_yards" TEXT,
    "lateral_sack_player_id" TEXT,
    "lateral_sack_player_name" TEXT,
    "interception_player_id" TEXT,
    "interception_player_name" TEXT,
    "lateral_interception_player_id" TEXT,
    "lateral_interception_player_name" TEXT,
    "punt_returner_player_id" TEXT,
    "punt_returner_player_name" TEXT,
    "lateral_punt_returner_player_id" TEXT,
    "lateral_punt_returner_player_name" TEXT,
    "kickoff_returner_player_name" TEXT,
    "kickoff_returner_player_id" TEXT,
    "lateral_kickoff_returner_player_id" TEXT,
    "lateral_kickoff_returner_player_name" TEXT,
    "punter_player_id" TEXT,
    "punter_player_name" TEXT,
    "kicker_player_name" TEXT,
    "kicker_player_id" TEXT,
    "own_kickoff_recovery_player_id" TEXT,
    "own_kickoff_recovery_player_name" TEXT,
    "blocked_player_id" TEXT,
    "blocked_player_name" TEXT,
    "tackle_for_loss_1_player_id" TEXT,
    "tackle_for_loss_1_player_name" TEXT,
    "tackle_for_loss_2_player_id" TEXT,
    "tackle_for_loss_2_player_name" TEXT,
    "qb_hit_1_player_id" TEXT,
    "qb_hit_1_player_name" TEXT,
    "qb_hit_2_player_id" TEXT,
    "qb_hit_2_player_name" TEXT,
    "forced_fumble_player_1_team" TEXT,
    "forced_fumble_player_1_player_id" TEXT,
    "forced_fumble_player_1_player_name" TEXT,
    "forced_fumble_player_2_team" TEXT,
    "forced_fumble_player_2_player_id" TEXT,
    "forced_fumble_player_2_player_name" TEXT,
    "solo_tackle_1_team" TEXT,
    "solo_tackle_2_team" TEXT,
    "solo_tackle_1_player_id" TEXT,
    "solo_tackle_2_player_id" TEXT,
    "solo_tackle_1_player_name" TEXT,
    "solo_tackle_2_player_name" TEXT,
    "assist_tackle_1_player_id" TEXT,
    "assist_tackle_1_player_name" TEXT,
    "assist_tackle_1_team" TEXT,
    "assist_tackle_2_player_id" TEXT,
    "assist_tackle_2_player_name" TEXT,
    "assist_tackle_2_team" TEXT,
    "assist_tackle_3_player_id" TEXT,
    "assist_tackle_3_player_name" TEXT,
    "assist_tackle_3_team" TEXT,
    "assist_tackle_4_player_id" TEXT,
    "assist_tackle_4_player_name" TEXT,
    "assist_tackle_4_team" TEXT,
    "tackle_with_assist" INTEGER,
    "tackle_with_assist_1_player_id" TEXT,
    "tackle_with_assist_1_player_name" TEXT,
    "tackle_with_assist_1_team" TEXT,
    "tackle_with_assist_2_player_id" TEXT,
    "tackle_with_assist_2_player_name" TEXT,
    "tackle_with_assist_2_team" TEXT,
    "pass_defense_1_player_id" TEXT,
    "pass_defense_1_player_name" TEXT,
    "pass_defense_2_player_id" TEXT,
    "pass_defense_2_player_name" TEXT,
    "fumbled_1_team" TEXT,
    "fumbled_1_player_id" TEXT,
    "fumbled_1_player_name" TEXT,
    "fumbled_2_player_id" TEXT,
    "fumbled_2_player_name" TEXT,
    "fumbled_2_team" TEXT,
    "fumble_recovery_1_team" TEXT,
    "fumble_recovery_1_yards" TEXT,
    "fumble_recovery_1_player_id" TEXT,
    "fumble_recovery_1_player_name" TEXT,
    "fumble_recovery_2_team" TEXT,
    "fumble_recovery_2_yards" TEXT,
    "fumble_recovery_2_player_id" TEXT,
    "fumble_recovery_2_player_name" TEXT,
    "sack_player_id" TEXT,
    "sack_player_name" TEXT,
    "half_sack_1_player_id" TEXT,
    "half_sack_1_player_name" TEXT,
    "half_sack_2_player_id" TEXT,
    "half_sack_2_player_name" TEXT,
    "return_team" TEXT,
    "return_yards" INTEGER,
    "penalty_team" TEXT,
    "penalty_player_id" TEXT,
    "penalty_player_name" TEXT,
    "penalty_yards" TEXT,
    "replay_or_challenge" INTEGER,
    "replay_or_challenge_result" TEXT,
    "penalty_type" TEXT,
    "defensive_two_point_attempt" INTEGER,
    "defensive_two_point_conv" INTEGER,
    "defensive_extra_point_attempt" INTEGER,
    "defensive_extra_point_conv" INTEGER,
    "safety_player_name" TEXT,
    "safety_player_id" TEXT,
    "season" INTEGER,
    "cp" DOUBLE PRECISION,
    "cpoe" DOUBLE PRECISION,
    "series" INTEGER,
    "series_success" INTEGER,
    "series_result" TEXT,
    "order_sequence" INTEGER,
    "start_time" TEXT,
    "time_of_day" TEXT,
    "stadium" TEXT,
    "weather" TEXT,
    "nfl_api_id" TEXT,
    "play_clock" TEXT,
    "play_deleted" TEXT,
    "play_type_nfl" TEXT,
    "special_teams_play" TEXT,
    "st_play_type" TEXT,
    "end_clock_time" TEXT,
    "end_yard_line" TEXT,
    "fixed_drive" TEXT,
    "fixed_drive_result" TEXT,
    "drive_real_start_time" TEXT,
    "drive_play_count" TEXT,
    "drive_time_of_possession" TEXT,
    "drive_first_downs" TEXT,
    "drive_inside20" TEXT,
    "drive_ended_with_score" TEXT,
    "drive_quarter_start" TEXT,
    "drive_quarter_end" TEXT,
    "drive_yards_penalized" TEXT,
    "drive_start_transition" TEXT,
    "drive_end_transition" TEXT,
    "drive_game_clock_start" TEXT,
    "drive_game_clock_end" TEXT,
    "drive_start_yard_line" TEXT,
    "drive_end_yard_line" TEXT,
    "drive_play_id_started" TEXT,
    "drive_play_id_ended" TEXT,
    "away_score" TEXT,
    "home_score" TEXT,
    "location" TEXT,
    "result" TEXT,
    "total" TEXT,
    "spread_line" TEXT,
    "total_line" TEXT,
    "div_game" TEXT,
    "roof" TEXT,
    "surface" TEXT,
    "temp" TEXT,
    "wind" TEXT,
    "home_coach" TEXT,
    "away_coach" TEXT,
    "stadium_id" TEXT,
    "game_stadium" TEXT,
    "aborted_play" TEXT,
    "success" TEXT,
    "passer" TEXT,
    "passer_jersey_number" TEXT,
    "rusher" TEXT,
    "rusher_jersey_number" TEXT,
    "receiver" TEXT,
    "receiver_jersey_number" TEXT,
    "pass" TEXT,
    "rush" TEXT,
    "first_down" TEXT,
    "special" TEXT,
    "play" TEXT,
    "passer_id" TEXT,
    "rusher_id" TEXT,
    "receiver_id" TEXT,
    "name" TEXT,
    "jersey_number" TEXT,
    "fantasy_player_name" TEXT,
    "fantasy_player_id" TEXT,
    "fantasy" TEXT,
    "fantasy_id" TEXT,
    "out_of_bounds" TEXT,
    "home_opening_kickoff" TEXT,
    "qb_epa" TEXT,
    "xyac_epa" TEXT,
    "xyac_mean_yardage" TEXT,
    "xyac_median_yardage" TEXT,
    "xyac_success" TEXT,
    "xyac_fd" TEXT,
    "xpass" TEXT,
    "pass_oe" TEXT,

    CONSTRAINT "Nflverse_Play_by_Play_2023_pkey" PRIMARY KEY ("play_id","game_id","home_team","away_team","season_type","week")
);
