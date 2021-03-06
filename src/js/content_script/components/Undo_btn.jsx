import React from 'react';
import { observer } from 'mobx-react';

import x from 'x';
import * as installing_theme from 'content_script/installing_theme';

import { Tr } from 'js/components/Tr';

export const Undo_btn = observer(() => {
    const undo_theme = () => {
        try {
            installing_theme.undo_theme(installing_theme.mut.previously_installed_theme_theme_id);

        } catch (er) {
            err(er, 200);
        }
    };

    return (
        <Tr
            attr={{
                className: 'undo_btn_w_2',
            }}
            tag="div"
            name="gen"
            state={installing_theme.ob.show_undo_btn}
        >
            <button
                type="button"
                className="cntfelph btn undo_btn"
                onClick={undo_theme}
            >
                {x.msg('undo_btn_text')}
            </button>
        </Tr>
    );
});
