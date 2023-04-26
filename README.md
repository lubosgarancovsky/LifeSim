# LifeSim
Simple ecosystem simulation, where actors collect food, water and procreate.


## Description

### World creation
In the beginning, a world is created randomly using **Perlin's noise**. It consists of ground and water tiles.
Sources of food are randomly distributed between the grass tiles.

Food sources ( green circles ) have a fixed amout of food they can hold.
When they are eaten, they shrink in size and slowly regrow back to their original size and original amount.

### Actors
Actors, who are put into this world then wander around, collecting food, water and procreating. They have an inventory with maximum amount of food and water they can hold.
When they have nothing to do and inventory is not full, they collect resources around them and store them for a difficult time that might come.
Actors have 3 needs:
    + Hunger
    + Thirst
    + Mating urge

Hunger is the most important need, and when it gets over 50%, actor starts looking for food, or eating from inventory, if it has a food in it.
Thirst comes next with the same process, and mating urge kicks makes actor look for mating partner when bigger than 90%.

Actors needs build up at speed that is determined by their genetic information. The first actors that appear randomly in the beginning of a simulation have randomized genes,
but actors who are born after succesfull mating have their genes calculated based on a genes of the parents.

Genes also contain information about fertility, viewrange and speed.

Every actor has a randomly chosen **name**, **id** and a **gender**.

### Ageing
Actors start with an age of 0, and the age is slowly incremented every update.
They became adult at 18, and will become able to mate.

With increasing age, a chance for an actor to die also increases, and no actor can live longer than 120 years.

### Eating
Food resources have an amount and maximum amount of food they can carry. If an actors hunger reaches 50%, a choice is made. If an actor has a food in his inventory, he will eat it on the spot and
the amout he eats is subtracted from the inventory. If his hunger is at 58%, he will eat up to 58 units of food.

If the actors inventory is empty, he will look for sources of food within his view range. When a food source is found, he will navigate towards it and if the source is reached, he starts eating.
When the actor eats, every frame a little amout of food is transfered from its source to the actor.
If a food supply gets depleted or if actors hunger is fully satisfied, he stops eating and starts wandering around.
Food source then start slowly growing back to its maximum amount.

### Drinking
Drinking works in very similar way as eating does, but the source of water is a tile of the world grid marked as water tile. It has no maximum amount and it is drank from until actors thirst
is fully satisfied.

Actors are forbidden to navigate in the water, so when they are thirsty, they navigate towards the ground tile neighbouring the water tile, they are about to drink from.

### Mating
When two adult actors reach 90% of mating urge, and the find each other. The find a tile within their viewrange and move towards it. When the target tile is reached, they start the proccess of mating. After mating, a female actor has a chance to get pregnant. If a female gets pregnant, after a while she will spawn from 1 to 3 children, while 1 being most common and 3 being very rare.
Children then continue on ther own.

### Collecting resources
Actors have an inventory with some space for food and water. If the actors has no needs to satify at the moment. He starts looking for closest resources and collects them into his inventory.
When he has a need to eat or drink, he first looks into his inventory for resources. Only if its empty, he starts looking outside for new resources.

### Movement
For movement, actors use an **A* pathfinding** alghoritm. They navigate a subgrid of a world grid.
This subgrid is calculated based on a `viewrange` of an actor. If a viewrange is 4, then the viewrange subgrid is (4 + 1) * (4 + 1) tiles big and centered around an actor.
This means, that in this situation, actor is able to see 4 tiles to the left 4 tiles to the right, 4 tiles up, and 4 tiles down. The extra tile in the equation is the one he is standing on.

Actors only see and can only interact with actors and resources withing the subgrd.

Also, they are only allowed to navigation the ground tiles, but they can see water tiles too, so they can find a water source.
When actor has no food or water resource to move towards, or a partner to mate with, he starts moving randomly by choosing a random tile within its viewrange subgrid.
Every time he reaches this random tile, he chooses a new one. Position within the tile is also chosen randomly.

### Decision making
Actors make their decisions using a simple **decision tree**.

### HUD
If hud is enabled, it displayes the age and a name in the first row above every actor.
Current action that is being performed is displayed below.

On the right of an actor, there are 3 bars indicating hunger, thirst and mating urge of an actor.
Progress bar that shows the current state of an performed action is shown as a black bar below the actor event if HUD is disabled.
Child actors have smaller radius that adult actors to make them easer to distinguish.

Acors gender is displayed by a thin outline with **blue** color for **male** and **purple** for a **female**

### UI
At the top of a screen, there is a black bar with a count of all actors in the scene.
In the right top corner. There are two buttons. The left button shows a screen with cards that hold informations about actors.
Right button shows a screen with the settings. This allows user to change the behavior of a simulation. Debug mode can also be enabled here.