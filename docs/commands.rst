
.. _permissions:

===================
Command Permissions
===================
The Following commands require `Administrator` or `Manage Server` permissions
*	``/announce```
*	``/get-announcement-history``
* 	``/get_suggestion_history``
* 	``/mark_suggestion_used``
* 	``/pick_random_suggestion``


.. _command_overviews:
=================
Command Overviews
=================

* ``/announce`` -- Used to create a SOTD announcement 
* ``/get_suggestion_history`` -- View the history of song suggestions
* ``/get_announcement_history`` -- View the history of all songs announced in the current Server
* ``/invite`` -- Get the invite for the bot to share it or add it to another server.
* ``/mark_suggestion_used`` -- Mark a suggestion as Used
* ``/pick_random_suggestion`` -- Pick a random suggestion from all unused suggestions in the server.
* ``/ping`` -- really a debug command
* ``/server`` -- view info about the server the command was ran from
* ``/suggest_song`` -- Suggest a song to possibly be used for SOTD
* ``/user`` -- view the info of the user who ran the command








.. SOTD Bot documentation master file, created by
   sphinx-quickstart on Fri Jun  9 13:34:25 2023.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

.. toctree::
   :maxdepth: 2

====================================
Welcome to SOTD Bot's documentation!
====================================
Current version: |release|


==================
Indices and tables
==================

* :ref:`genindex`
* :ref:`search`

=============================================
Getting Started With Announcements
=============================================
1. Invite the bot using the URL <https://discord.com/api/oauth2/authorize?client_id=1014226427429798009&permissions=412317240384&scope=bot%20applications.commands>
2. Create a role to ping when there is a new song announcement. I.E @Daily Song or @SOTD
3. To send an announcement use the ``/announce`` command. 
4. To view the announcement history for your server use the ``/get-announcement-history`` command.
5. By default only server administrators can create a Song of the Day announcement and view announcement history.
6. To view a list of all commands and their parameters please look at :doc:`/commands` 







Last edited: |today|
