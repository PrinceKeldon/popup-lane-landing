-- Add lane closing date column
ALTER TABLE lane_settings 
ADD COLUMN lane_close_date TIMESTAMP WITH TIME ZONE;