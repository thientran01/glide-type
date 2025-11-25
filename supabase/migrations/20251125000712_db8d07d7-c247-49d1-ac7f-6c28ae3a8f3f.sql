-- Change total_drag_distance from integer to numeric to support decimal values
ALTER TABLE trials 
ALTER COLUMN total_drag_distance TYPE numeric;