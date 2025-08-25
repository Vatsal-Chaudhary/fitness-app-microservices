import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router';
import { getActivityDetail } from '../services/api';
import {
    Box,
    Card,
    CardContent,
    Divider,
    Typography,
    CircularProgress,
    Alert
} from '@mui/material';

const ActivityDetail = () => {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);

    const fetchActivityDetail = async () => {
        try {
            console.log(`Fetching activity detail for ID: ${id}`);
            const response = await getActivityDetail(id);

            setActivity(response.data);
            setLoading(false);
            setError(null);

            // Stop polling when we get the data
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            console.log('Activity detail fetched successfully:', response.data);

        } catch (error) {
            console.error('Failed to fetch activity detail:', error);

            // For 500/503 errors (AI still processing), just keep polling silently
            if (error.response?.status === 500 || error.response?.status === 503) {
                // Don't show error, just keep loading state
                if (!intervalRef.current) {
                    // Start polling every 3 seconds
                    intervalRef.current = setInterval(() => {
                        fetchActivityDetail();
                    }, 3000);
                }
            } else {
                // Show error for other types of errors
                setError(`Failed to load activity: ${error.message}`);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchActivityDetail();

        // Cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [id]);

    if (loading && !activity) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 400,
                    gap: 2
                }}
            >
                <CircularProgress size={60} />
                <Typography variant="h6" gutterBottom>
                    Loading Activity Details...
                </Typography>
            </Box>
        );
    }

    if (error && !activity) {
        return (
            <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
                <Alert severity="error">
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!activity) {
        return (
            <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
                <Alert severity="warning">
                    Activity not found
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>Activity Details</Typography>
                    <Typography>Type: {activity.activityType || activity.type || activity.name}</Typography>
                    <Typography>Duration: {activity.duration} minutes</Typography>
                    <Typography>Calories Burned: {activity.caloriesBurned || activity.calories}</Typography>
                    <Typography>Date: {new Date(activity.createdAt || activity.date).toLocaleString()}</Typography>
                </CardContent>
            </Card>

            {activity.recommendation ? (
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>AI Recommendation</Typography>
                        <Typography variant="h6">Analysis</Typography>
                        <Typography paragraph>{activity.recommendation}</Typography>

                        {activity.improvements && activity.improvements.length > 0 && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6">Improvements</Typography>
                                {Array.isArray(activity.improvements) ? (
                                    activity.improvements.map((improvement, index) => (
                                        <Typography key={index} paragraph>• {improvement}</Typography>
                                    ))
                                ) : (
                                    <Typography paragraph>• {activity.improvements}</Typography>
                                )}
                            </>
                        )}

                        {activity.suggestions && activity.suggestions.length > 0 && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6">Suggestions</Typography>
                                {activity.suggestions.map((suggestion, index) => (
                                    <Typography key={index} paragraph>• {suggestion}</Typography>
                                ))}
                            </>
                        )}

                        {activity.safety && activity.safety.length > 0 && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6">Safety Guidelines</Typography>
                                {activity.safety.map((safety, index) => (
                                    <Typography key={index} paragraph>• {safety}</Typography>
                                ))}
                            </>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent>
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <CircularProgress sx={{ mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Generating AI Recommendations...
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Our AI is analyzing your {activity.activityType || activity.type || activity.name} activity.
                                <br />
                                This may take up to 60 seconds.
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default ActivityDetail;