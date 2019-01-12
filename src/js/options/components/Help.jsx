//> Help c

//>1 show or hide help_message when clicking on help_link t

//^

import React from 'react';
import { observable, action, configure } from 'mobx';
import { observer } from 'mobx-react';

import { Tr } from 'js/Tr';

configure({ enforceActions: true });

//> Help c
export class Help extends React.Component {
    //>1 show or hide help_message when clicking on help_link t
    show_or_hide_help_message = action(e => {
        e.preventDefault(e);

        this.ob.show_help_message = !this.ob.show_help_message;
    });
    //<1 show or hide help_message when clicking on help_link t

    constructor(props) {
        super(props);

        ({
            add_help: this.add_help,
            name: this.name,
        } = this.props);

        this.ob = observable({
            show_help_message: false,
        });
    }

    render() {
        return this.add_help
            ? (
                <React.Fragment>
                    <button
                        type="button"
                        className="help_link"
                        data-help-message={`${this.name}_help_message`}
                        data-text="help_link_text"
                        href="#"
                        onClick={this.show_or_hide_help_message}
                    />
                    <Tr
                        attr={{
                            className: 'help_message',
                            'data-text': `${this.name}_help_message_text`,
                        }}
                        tag="div"
                        name="gen"
                        state={this.ob.show_help_message}
                    />
                </React.Fragment>
            )
            : null;
    }
}
//< Help c

observer(Help);