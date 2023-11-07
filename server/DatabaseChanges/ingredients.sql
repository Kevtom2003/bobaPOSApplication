ALTER TABLE teaorders
ADD ingredients varchar(255);

ALTER TABLE teaorders
ADD descriptions varchar(255);

UPDATE teaorders
SET ingredients = 'Green Tea, Cane Sugar Syrup', descriptions = 'A refreshing, classic Green Tea'
WHERE tea_name = 'Green Tea';

UPDATE teaorders
SET ingredients = 'Black Tea, Rosehip Powder, Milk Powder', descriptions = 'A sweet, tart rose drink'
WHERE tea_name = 'Rosehip Milk Tea';

UPDATE teaorders
SET ingredients = 'Black Tea, Cane Sugar Syrup, Milk Powder, Espresso', descriptions = 'A tasteful milk tea with some extra kick!'
WHERE tea_name = 'Coffee Milk Tea';

UPDATE teaorders
SET ingredients = 'Black Tea, Cane Sugar Syrup, Milk Powder, Taro Syrup', descriptions = 'A light, nutty flavored milk tea'
WHERE tea_name = 'Taro Milk Tea';

UPDATE teaorders
SET ingredients = 'Black Tea, Honey Syrup, Milk Powder', descriptions = 'A classic milk tea with some extra honey sweetness'
WHERE tea_name = 'Honey Milk Tea';

Update teaorders
SET ingredients = 'Thai Tea, Cane Sugar Syrup, Milk Powder', descriptions = 'A slightly floral, mildly sweet, and a bit spicy'
WHERE tea_name = 'Thai Milk Tea';

UPDATE teaorders
SET ingredients = 'Black Tea, Cane Sugar Syrup, Milk Powder, Coconut Powder, Caseinate, Artifical Coconut Flavor, Water', descriptions = 'A classic milk tea with coconut milk for a different taste'
WHERE tea_name = 'Coconut Milk Tea';

UPDATE teaorders
SET ingredients = 'Black Tea, Almond Syrup, Milk Powder, Water', descriptions = 'A classic milk tea, but healthier'
WHERE tea_name = 'Almond Milk Tea';

UPDATE teaorders
SET ingredients = 'Green Tea, Cane Sugar Syrup, Mango Syrup', descriptions = 'A mango take on green tea', tea_name = 'Mango Green Tea'
WHERE tea_name = 'Seasonal Mango Boba';

UPDATE teaorders
SET ingredients = 'Torani Peppermint Bark Sauce, Black Tea, Milk Powder, Hersheys Chocolate Syrup', descriptions = 'A nice peppermint taste to cheer you up this holiday!', tea_name = 'Peppermint Milk Tea'
WHERE tea_name = 'Seasonal Boba';

UPDATE teaorders
SET ingredients = 'Cane Sugar Syrup, Milk Powder, Espresso, Water', descriptions = 'Coffee but as a slush!', tea_name = 'Coffee Slush'
WHERE tea_name = 'Slush Boba';