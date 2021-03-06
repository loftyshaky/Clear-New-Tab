import React from 'react';

import x from 'x';
import * as analytics from 'js/analytics';

export const Theme_img_link = () => {
    //> open theme image when clicking on 'this'(install_help_theme_img_link) in install_help or theme_img_link
    const open_theme_background = async e => {
        try {
            e.preventDefault();

            analytics.send_btns_event('upload', 'theme_img_link');

            const background = await x.get_background();

            background.open_theme_background();

        } catch (er) {
            err(er, 93);
        }
    };
    //< open theme image when clicking on 'this'(install_help_theme_img_link) in install_help or theme_img_link

    return (
        <button
            type="button"
            className="link theme_img_link"
            data-text="theme_img_link_text"
            onClick={open_theme_background}
        />
    );
};
