# ggg.favorite Model Spec

## Model Definition

```python
class GggFavorite(models.Model):
    _name = 'ggg.favorite'
    _description = 'App Launcher Favorite'
    _order = 'sequence, id'

    name = fields.Char(required=True)
    url = fields.Char(required=True)
    user_id = fields.Many2one('res.users', required=True, default=lambda self: self.env.user, ondelete='cascade')
    sequence = fields.Integer(default=10)
```

## Security

### Access Rights (ir.model.access.csv)

| id | name | model_id:id | group_id:id | perm_read | perm_write | perm_create | perm_unlink |
|----|------|-------------|-------------|-----------|------------|-------------|-------------|
| access_ggg_favorite_user | ggg.favorite.user | model_ggg_favorite | base.group_user | 1 | 1 | 1 | 1 |

### Record Rule (ggg_favorite_rule.xml)

```xml
<record id="ggg_favorite_own_rule" model="ir.rule">
    <field name="name">Own Favorites Only</field>
    <field name="model_id" ref="model_ggg_favorite"/>
    <field name="domain_force">[('user_id','=',user.id)]</field>
    <field name="groups" eval="[(4, ref('base.group_user'))]"/>
</record>
```
