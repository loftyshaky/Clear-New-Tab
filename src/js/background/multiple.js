import * as r from 'ramda';

import x from 'x';
import { db } from 'js/init_db';
import * as get_ms_left from 'js/get_ms_left';
import * as last_background_change_time from 'js/last_background_change_time';
import * as get_new_future_background from 'js/get_new_future_background';
import * as generate_random_color from 'js/generate_random_color';
import * as backgrounds from 'background/backgrounds';
import * as tabs from 'background/tabs';

export const start_timer = x.debounce(async update_last_background_change_time => {
    try {
        const ed_all = await eda();

        if ((!mut.run_start_timer_f_once && !ed_all.background_already_changed) || (!ed_all.background_already_changed && (ed_all.mode === 'multiple' || ed_all.mode === 'random_solid_color'))) {
            mut.run_start_timer_f_once = true;

            const ms_left = await get_ms_left.get_ms_left();

            start_timer_inner(ms_left, update_last_background_change_time);

        } else {
            await db.ed.update(1, { background_already_changed: false });
            await last_background_change_time.update_last_background_change_time();
            await start_timer_inner(ed_all.change_interval, update_last_background_change_time);
        }

    } catch (er) {
        err(er, 6, null, true);
    }
}, 50);

const start_timer_inner = async (ms_left, update_last_background_change_time) => {
    try {
        clear_timer();

        mut.timers.push(setTimeout(async () => {
            try {
                await get_next_background();

                if (update_last_background_change_time) {
                    last_background_change_time.update_last_background_change_time();
                }

                const ed_all = await eda();

                if (ed_all.mode === 'multiple' || ed_all.mode === 'random_solid_color') {
                    mut.timers.push(setTimeout(async () => {
                        try {
                            if (ed_all.slideshow) {
                                x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'change_background' }]);
                            }

                            const at_least_one_new_tab_tab_opened = tabs.mut.new_tabs_ids.length > 0;
                            const no_new_tab_tabs_opened = tabs.mut.new_tabs_ids.length === 0;

                            if (at_least_one_new_tab_tab_opened) {
                                if (ed_all.slideshow) {
                                    start_timer_inner(ed_all.change_interval, true);

                                } else {
                                    await db.ed.update(1, { background_already_changed: true });
                                }

                            } else if (no_new_tab_tabs_opened) {
                                await db.ed.update(1, { background_already_changed: true });
                            }

                        } catch (er) {
                            err(er, 9, null, true);
                        }
                    }, ed_all.change_interval == 1 ? 3000 : 0)); // eslint-disable-line eqeqeq
                }

            } catch (er) {
                err(er, 8, null, true);
            }
        }, ms_left));

    } catch (er) {
        err(er, 7, null, true);
    }
};

export const clear_timer = () => {
    try {
        for (const timer of mut.timers) {
            clearTimeout(timer);

            mut.timers = r.without([timer], mut.timers);
        }

    } catch (er) {
        err(er, 10, null, true);
    }
};

//> decide what image to show next
export const get_next_background = async run_even_if_get_next_background_f_is_running_var_is_true => {
    try {
        if (!mut.get_next_background_f_is_running || run_even_if_get_next_background_f_is_running_var_is_true) {
            mut.get_next_background_f_is_running = true;

            const ed_all = await eda();

            if (ed_all.mode === 'multiple') {
                const new_current_background = ed_all.future_background;
                const new_future_background = new_current_background + 1;

                await db.ed.update(1, { current_background: new_current_background });
                await get_new_future_background.get_new_future_background(new_future_background);
                await backgrounds.preload_current_and_future_background('new_current_background');

                x.iterate_all_tabs(x.send_message_to_tab, [{ message: 'change_current_background_input_val' }]);

            } else if (ed_all.mode === 'random_solid_color') {
                await db.ed.update(1, { current_random_color: generate_random_color.generate_random_color() });
            }
        }

        mut.finished_running_get_next_background_once = true;
        mut.get_next_background_f_is_running = false;

    } catch (er) {
        err(er, 11, null, true);
    }
};
//< decide what image to show next

export const mut = {
    timers: [],
    get_next_background_f_is_running: false,
    run_start_timer_f_once: false,
    finished_running_get_next_background_once: false,
};
