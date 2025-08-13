import joblib

feature_columns = [
    'mp_5_x', 'fg_5_x', 'fga_5_x', 'fg%_5_x', '3p_5_x', '3pa_5_x', '3p%_5_x',
    'ft_5_x', 'fta_5_x', 'ft%_5_x', 'orb_5_x', 'drb_5_x', 'trb_5_x',
    'ast_5_x', 'stl_5_x', 'blk_5_x', 'tov_5_x', 'pf_5_x', 'pts_5_x',
    'ts%_5_x', 'efg%_5_x', '3par_5_x', 'ftr_5_x', 'orb%_5_x', 'drb%_5_x',
    'trb%_5_x', 'ast%_5_x', 'stl%_5_x', 'blk%_5_x', 'tov%_5_x', 'usg%_5_x',
    'ortg_5_x', 'drtg_5_x', 'fg_max_5_x', 'fga_max_5_x', 'fg%_max_5_x',
    '3p_max_5_x', '3pa_max_5_x', '3p%_max_5_x', 'ft_max_5_x', 'fta_max_5_x',
    'ft%_max_5_x', 'orb_max_5_x', 'drb_max_5_x', 'trb_max_5_x', 'ast_max_5_x',
    'stl_max_5_x', 'blk_max_5_x', 'tov_max_5_x', 'pf_max_5_x', 'pts_max_5_x',
    '+/-_max_5_x', 'ts%_max_5_x', 'efg%_max_5_x', '3par_max_5_x',
    'ftr_max_5_x', 'orb%_max_5_x', 'drb%_max_5_x', 'trb%_max_5_x',
    'ast%_max_5_x', 'stl%_max_5_x', 'blk%_max_5_x', 'tov%_max_5_x',
    'usg%_max_5_x', 'ortg_max_5_x', 'drtg_max_5_x', 'total_5_x', 'home_5_x',
    'mp_opp_5_x', 'fg_opp_5_x', 'fga_opp_5_x', 'fg%_opp_5_x', '3p_opp_5_x',
    '3pa_opp_5_x', '3p%_opp_5_x', 'ft_opp_5_x', 'fta_opp_5_x',
    'ft%_opp_5_x', 'orb_opp_5_x', 'drb_opp_5_x', 'trb_opp_5_x', 'ast_opp_5_x',
    'stl_opp_5_x', 'blk_opp_5_x', 'tov_opp_5_x', 'pf_opp_5_x', 'pts_opp_5_x',
    'ts%_opp_5_x', 'efg%_opp_5_x', '3par_opp_5_x', 'ftr_opp_5_x',
    'orb%_opp_5_x', 'drb%_opp_5_x', 'trb%_opp_5_x', 'ast%_opp_5_x',
    'stl%_opp_5_x', 'blk%_opp_5_x', 'tov%_opp_5_x', 'usg%_opp_5_x',
    'ortg_opp_5_x', 'drtg_opp_5_x'
]

joblib.dump(feature_columns, 'feature_columns.pkl')
print("✅ feature_columns.pkl has been recreated!")
