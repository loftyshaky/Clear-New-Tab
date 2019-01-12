//> Tr c

//>1 observables t

//>1 choose component mode (shown or hidden) t

//>1 hide component when it faded out or show component when it starting fading in t

//>1 create fade transitions t

//>1 create other transitions f

//>1 camel_case_to_dash f

//^

import React from 'react';
import { decorate, observable, action, configure } from 'mobx';
import { observer } from 'mobx-react';
import * as r from 'ramda';

configure({ enforceActions: true });

//> Tr c
export class Tr extends React.Component {
    constructor(props) {
        super(props);


        ({
            name: this.name,
            attr: this.attr,
            children: this.children,
            delete_all_images_tr_end: this.delete_all_images_tr_end,
            tr_end_callbacks: this.tr_end_callbacks,
        } = this.props);

        this.normal_duration = 200;
        this.transitions = {
            gen: this.create_fade(this.normal_duration), // general
            imgs_w_1: this.create_fade(this.normal_duration),
            dragged_img: this.create_fade(this.normal_duration, 0.8), // general
            theme_img_link: this.create_fade(this.normal_duration),
            img: this.create_fade(400),
            loading_screen: this.create_fade(400),
            upload_box: this.create_tran(this.normal_duration, 'backgroundColor', '#5d7daf', '#3b6ab5'), // 3b6ab5
        };

        //>1 observables t
        this.display_style = {};
        //<1 observables t
    }

    componentWillMount() {
        this.hide_component(false);
    }

    componentDidUpdate() {
        this.hide_component(true);
    }

    //>1 choose component mode (shown or hidden) t
    transit = (name, state) => {
        const result = state ? this.transitions[name].active : this.transitions[name].def;

        return result;
    }
    //<1 choose component mode (shown or hidden) t

    //>1 hide component when it faded out or show component when it starting fading in t
    hide_component = (called_from_component_did_update, tr_end_callbacks, e) => {
        const { state } = this.props;
        const component_is_active = state;
        const component_is_visible = this.display_style.visibility;
        const component_uses_fading_transition = 'opacity' in this.transitions[this.name].active;

        if (this.name !== 'img' && !called_from_component_did_update && !component_is_active && component_uses_fading_transition) {
            if (!component_is_active) {
                this.display_style = {
                    position: 'fixed',
                    visibility: 'hidden',
                };
            }

        } else if (state) {
            if (component_is_visible) {
                this.display_style = {};
            }
        }

        if (!called_from_component_did_update) {
            if (this.name === 'imgs_w_1') {
                this.delete_all_images_tr_end();
            }
        }

        if (tr_end_callbacks && !component_is_active) {
            tr_end_callbacks.forEach(f => f(e));
        }
    }
    //<1 hide component when it faded out or show component when it starting fading in t

    //>1 create fade transitions t
    create_fade = (duration, opacity) => {
        const fade = {
            def: {
                opacity: 0,
                transition: `opacity ${duration}ms ease-out`,
            },
            active: {
                opacity: opacity || 1,
                transition: `opacity ${duration}ms ease-out`,
            },
        };

        return fade;
    };
    //<1 create fade transitions t

    //>1 create other transitions f
    create_tran = (duration, type, def, active) => {
        const tran = {
            def: {
                [type]: def,
                transition: `${this.camel_case_to_dash(type)} ${duration}ms ease-out`,
            },

            active: {
                [type]: active,
                transition: `${this.camel_case_to_dash(type)} ${duration}ms ease-out`,
            },
        };

        return tran;
    };
    //<1 create other transitions f

    //>1 camel_case_to_dash f
    camel_case_to_dash = str => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    //<1 camel_case_to_dash f

    render() {
        const { state } = this.props;
        return (
            <this.props.tag
                {...this.attr}
                ref={this.tr}
                style={r.merge(this.transit(this.name, state), this.display_style)}
                onTransitionEnd={this.hide_component.bind(null, false, this.tr_end_callbacks)}
            >
                {this.children}
            </this.props.tag>
        );
    }
}
//< Tr c

decorate(Tr, {
    display_style: observable,

    hide_component: action,
});

observer(Tr);