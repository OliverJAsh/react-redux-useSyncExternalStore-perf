import * as React from 'react';
import { createRoot } from 'react-dom/client';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';

type State = {
    value: boolean;
};

const reduxStore = Redux.createStore(
    (state: State = { value: false }): State => ({ value: !state.value }),
);

export const Expensive: React.FC = () => {
    // Hog main thread for 100 milliseconds
    const start = Date.now();
    while (Date.now() - start < 100) {
        // do nothing
    }

    console.log('Render Expensive');

    return <div style={{ border: '1px solid black' }}>Expensive</div>;
};

export const App = () => {
    console.log('Render App');

    const [_reactState, setReactState] = React.useState(false);

    const _reduxState = ReactRedux.useSelector(
        (state) => (state as State).value,
    );

    return (
        <div>
            <button
                onClick={() => {
                    console.log('startTransition');
                    React.startTransition(() => {
                        console.log('setReactState');
                        setReactState((state) => !state);
                    });
                }}
            >
                Trigger React state update
            </button>

            <button
                onClick={() => {
                    console.log('startTransition');
                    React.startTransition(() => {
                        console.log('reduxStore.dispatch');
                        reduxStore.dispatch({ type: 'foo' });
                    });
                }}
            >
                Trigger Redux state update (dispatch)
            </button>

            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <Expensive key={value} />
            ))}
        </div>
    );
};

createRoot(document.getElementById('root')!).render(
    <ReactRedux.Provider store={reduxStore}>
        <App />
    </ReactRedux.Provider>,
);
