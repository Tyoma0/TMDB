import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../../features/themeSlice.ts';
import type {RootState} from "../../../app/store.ts";


export const ThemeButton = () => {
    const dispatch = useDispatch();
    const mode = useSelector((state: RootState) => state.theme.mode);

    return (
        <button
            onClick={() => dispatch(toggleTheme())}
            style={{
                background: 'none',
                border: 'none',
                color: '#000000',
                cursor: 'pointer',
                fontSize: '24px',
                padding: '8px',
                marginLeft: '10px'
            }}
        >
            {mode === 'light' ? '🌙' : '☀️'}
        </button>
    );
};