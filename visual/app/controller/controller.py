"""

	Main orchestrator class

"""

import uuid

console = op.console
state = op.state
# sequencer = op.sequencer


class controller:

	def __init__( self, ownerComp ):
		return


	def Startup( self ):

		project.realTime = False

		console.State( 'App starting up...' )

		# RESET the state values that should not persist
		state.par.Setdefaults.pulse()

		if ( op.env.Get( 'ENV' ) == 'dev' ):
			op.state.Set( 'APP_SHOW_DEV', 1 )
		else:
			op.state.Set( 'APP_SHOW_DEV', 0 )

		# LOAD local content
		op.content.Load()
		op.weather.Fetch()

		# INIT screen recorder module
		op.screen_recorder.op('./recorder').par.record = False
		op.screen_recorder.op('./count1').par.resetpulse.pulse()

		# TEST for connectivity right away
		op('/app/online_status').ext.triggers.Check()

		# INIT socket
		# op.socket.Connect()
		
		# INIT sequencer
		# op.sequencer.Init()

		# op.glsl.CreateDefines()								# not sure if broken with externalized shaders	
		run( "op.glsl.CreateDefines()", delayFrames=( 60 ) )	# use this if externalizing these shaders
		
		return


	def FinishStartup( self ):

		self.RefreshSessionId()

		# op.state.Set( 'APP_STARTING_UP', 0 )

		# op.sequencer.Reset()

		# op.analytics.Emit( 'APP_STARTED_UP' )
		
		run( "op.state.Set( 'APP_STARTING_UP', 0 )", delayFrames=1 )

		run( "op.console.State( 'App started up' )", delayFrames=2 )

		if ( op.env.Get('APP_REALTIME') > 0 ):
			run( "project.realTime = True", delayFrames=3 )

		return


	def OnSave( self ):
		timestamp = console.GetTimestamp()
		op.state.Set( 'APP_LAST_UPDATED', timestamp )
		return


	def ResetSession( self ):
		self.RefreshSessionId()
		return

	def RefreshSessionId( self ) :
		new_uuid = str( uuid.uuid1() )
		state.Set( 'SESSION_ID', new_uuid )
		return

	def GenerateUUID( self ):
		new_uuid = str( uuid.uuid1() )
		return new_uuid


	# - - - CMS Realtime WebSocket connection status

	def LostSocketConnection( self ):
		op.state.Set( 'SOCKET_CONNECTED', 0 )
		if ( not state.Get('APP_STARTING_UP') > 0 ):
			console.State( 'Socket connection to CMS lost' )
		return

	def ResumeSocketConnection( self ):
		console.State( 'Socket connection to CMS acquired' )
		op.state.Set( 'SOCKET_CONNECTED', 1 )
		return


	# - - - Audio connection status

	def LostAudioHeart( self ):
		op.state.Set( 'AUDIO_ALIVE', 0 )
		if ( not state.Get('APP_STARTING_UP') > 0 ):
			console.State( 'Audio connection lost' )
		return

	def ResumeAudioHeart( self ):
		op.state.Set( 'AUDIO_ALIVE', 1 )
		console.State( 'Audio connection acquired' )
		op.audio.StartBeds()
		run( "op.audio.ApplyBedState( str( op.state.Get('SCENE_CURRENT') ) )", delayFrames=60 )
		return


	# - - - Internet connection status

	def LostInternetConnection( self ):
		if ( not state.Get('APP_STARTING_UP') > 0 ):
			console.State( 'Internet connection lost' )
		return

	def ResumeInternetConnection( self ):
		console.State( 'Internet connection acquired' )
		if ( state.Get('APP_STARTING_UP') > 0 ):
			op.presentations.Fetch()
		return


	# - - - Healthy status

	def LostHealthy( self ):
		op.state.Set( 'APP_HEALTHY', 0 )
		console.State( 'Application is not healthy...' )
		return

	def ResumeHealthy( self ):
		op.state.Set( 'APP_HEALTHY', 1 )
		console.State( 'Application is healthy' )
		return



