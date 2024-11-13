import { MenuItem, Select, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useStageTwo } from "../../providers/StageTwoProvider";
import { setSettings } from "../settings/SettingsService";

const invisibleBorder = {
  border: "1px solid transparent", // Makes the border transparent
  padding: "8px",
};
export default function DataTable({ started, stage1, stage2 }) {
  const { isStageTwoOpen, isStageOneOpen } = useStageTwo();
  const [isStageAOpen, setIsStageAOpen] = useState(isStageOneOpen);
  const [isStageBOpen, setIsStageBOpen] = useState(isStageTwoOpen);
  const [isStageStatusChanged, setIsStageStatusChanged] = useState(false);
  useEffect(() => {
    if (isStageAOpen !== isStageOneOpen || isStageBOpen !== isStageTwoOpen) {
      setIsStageStatusChanged(true);
    }
  }, [isStageAOpen, isStageBOpen, isStageOneOpen, isStageTwoOpen]);

  useEffect(() => {
    if (isStageStatusChanged) {
      setSettings({ stageOne: isStageAOpen, stageTwo: isStageBOpen }).then(
        () => {
          setIsStageStatusChanged(false);
        }
      );
    }
  }, [isStageStatusChanged, isStageAOpen, isStageBOpen]);
  const confirmAndSetStage = (newValue, currentValue, setter) => {
    if (newValue === currentValue) return; // No change made
    const userConfirmed = window.confirm("האם אתה בטוח שברצונך לבצע שינוי?");
    if (userConfirmed) {
      setter(newValue);
    }
    // No else needed, as we don't need to revert state; the UI will naturally revert because we're not setting the new value on cancel.
  };
  return (
    <div>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <tbody>
          <tr>
            <td style={{ ...invisibleBorder, width: "30%" }}>
              <Typography variant="h5" sx={{ p: 4 }}>
                סה"כ התחילו תהליך מענה על השאלון
              </Typography>
            </td>
            <td style={invisibleBorder}>
              <Typography variant="h5" sx={{ p: 4 }}>
                {started}
              </Typography>
            </td>
          </tr>
          <tr>
            <td style={{ ...invisibleBorder, width: "30%" }}>
              <Typography variant="h5" sx={{ p: 4 }}>
                סה"כ השלימו את שלב א'
              </Typography>
            </td>
            <td style={invisibleBorder}>
              <Typography variant="h5" sx={{ p: 4 }}>
                {stage1}
              </Typography>
            </td>
          </tr>
          <tr>
            <td style={{ ...invisibleBorder, width: "30%" }}>
              <Typography variant="h5" sx={{ p: 4 }}>
                סה"כ השלימו את שלב ב'
              </Typography>
            </td>
            <td style={invisibleBorder}>
              <Typography variant="h5" sx={{ p: 4 }}>
                {stage2}
              </Typography>
            </td>
          </tr>
          <tr>
            <td
              style={{ ...invisibleBorder, verticalAlign: "top", width: "30%" }}
            >
              <Typography variant="h5" sx={{ p: 4 }}>
                פתיחת שלב א'
              </Typography>
            </td>
            <td style={invisibleBorder}>
              <Select
                value={isStageAOpen}
                onChange={(e) =>
                  confirmAndSetStage(
                    e.target.value,
                    isStageAOpen,
                    setIsStageAOpen
                  )
                }
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value={true}>פתוח</MenuItem>
                <MenuItem value={false}>סגור</MenuItem>
              </Select>
            </td>
          </tr>
          <tr>
            <td
              style={{ ...invisibleBorder, verticalAlign: "top", width: "30%" }}
            >
              <Typography variant="h5" sx={{ p: 4 }}>
                פתיחת שלב ב'
              </Typography>
            </td>
            <td style={invisibleBorder}>
              <Select
                value={isStageBOpen}
                onChange={(e) =>
                  confirmAndSetStage(
                    e.target.value,
                    isStageBOpen,
                    setIsStageBOpen
                  )
                }
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value={true}>פתוח</MenuItem>
                <MenuItem value={false}>סגור</MenuItem>
              </Select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
