import React, {useRef, useState} from 'react';
import Button from "@mui/material/Button";
import {Box} from "@mui/material";
import exportFromJSON from "export-from-json";
import {IMPORT_ERROR, parseImport, writeRecord} from '../bible/readingRecord';

export default function ControlPanel(props) {

    const controlPanelButtonStyles = {
        minWidth: 250,
        maxWidth: 250,
    }

    const {readStatus, setReadStatus} = props;
    const inputRef = useRef(null);
    const [loadError, setLoadError] = useState('');

    const handleSave = () => {
        const data = [{readStatus: readStatus}];
        const fileName = "application-state";
        const exportType = exportFromJSON.types.json;
        exportFromJSON({data, fileName, exportType});
    };
    const handleInputLoad = (event) => {
        const input = event.target;
        const file = input.files && input.files[0];
        input.value = '';
        if (!file) {
            return;
        }
        file.text()
            .then((text) => {
                const parsed = parseImport(text);
                if (!parsed.ok) {
                    setLoadError(IMPORT_ERROR);
                    return;
                }
                setLoadError('');
                setReadStatus(writeRecord(parsed.record));
            })
            .catch(() => {
                setLoadError(IMPORT_ERROR);
            });
    };

    const handleLoad = () => {
        if (!inputRef || !inputRef.current) return;
        inputRef.current.click();
    };

    const handleClearAll = () => {
        setLoadError('');
        setReadStatus(writeRecord({}));
    };


    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Button variant={"contained"} onClick={handleClearAll} sx={controlPanelButtonStyles}>Clear All</Button>
            <Box sx={{
                flex: '0 0 12px'
            }}></Box>
            <Button variant={"contained"} onClick={handleSave} sx={controlPanelButtonStyles}>Save bible study record</Button>
            <Box sx={{
                flex: '0 0 12px'
            }}></Box>
            <Button variant={"contained"} onClick={handleLoad} sx={controlPanelButtonStyles}>
                Load bible study record
                <input
                    ref={inputRef}
                    type="file"
                    onChange={handleInputLoad}
                    accept=".json"
                    hidden
                />
            </Button>
            {loadError ? <p role="alert">{loadError}</p> : null}
        </Box>
    );
};
